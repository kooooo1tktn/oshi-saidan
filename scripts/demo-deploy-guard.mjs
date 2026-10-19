import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// 公開デモの保存先と配信先を照合し、誤った設定での配信を止める。
export function validateDemoDeployment(env, firebaseConfig, firebaseRc) {
  const expectedProject = "oshi-saidan";
  const expectedRef = "tbdgcoarawanktqytlef";
  const failures = [];
  if (env.GITHUB_REF !== "refs/heads/main") failures.push("main以外からは配信できません");
  if (!["push", "workflow_dispatch"].includes(env.GITHUB_EVENT_NAME)) {
    failures.push("許可されていないイベントです");
  }
  if (env.VITE_DEMO_MODE !== "true") failures.push("デモモードが有効ではありません");
  if (env.VITE_SUPABASE_URL !== `https://${expectedRef}.supabase.co`) {
    failures.push("Supabaseの接続先がデモ専用プロジェクトと一致しません");
  }
  const key = env.VITE_SUPABASE_ANON_KEY ?? "";
  if (key.startsWith("sb_publishable_") && key.length > 25) {
    // Publishable keyはプロジェクトrefを含まないため、CIの読取要求で照合する。
  } else {
    try {
      const parts = key.split(".");
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      if (parts.length !== 3 || payload.role !== "anon" || payload.ref !== expectedRef) {
        failures.push("公開用anonキーの種別またはプロジェクトが一致しません");
      }
    } catch {
      failures.push("有効な公開用キーが設定されていません");
    }
  }
  if (env.FIREBASE_PROJECT_ID !== expectedProject || firebaseRc.projects?.default !== expectedProject) {
    failures.push("Firebaseプロジェクトが一致しません");
  }
  const hosting = firebaseConfig.hosting;
  if (Array.isArray(hosting) || hosting?.site !== expectedProject || hosting?.target || hosting?.public !== "dist") {
    failures.push("Hostingサイトまたは配信ディレクトリが一致しません");
  }
  try {
    const account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT ?? "");
    if (account.type !== "service_account" || account.project_id !== expectedProject ||
        !account.client_email || !account.private_key?.includes("BEGIN PRIVATE KEY")) {
      failures.push("Firebaseサービスアカウントの設定が一致しません");
    }
  } catch {
    failures.push("Firebaseサービスアカウントが設定されていません");
  }
  return failures;
}

// コマンド実行時だけ設定を読む。キーや認証JSONの値は出力しない。
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const failures = validateDemoDeployment(
      process.env,
      JSON.parse(readFileSync("firebase.json", "utf8")),
      JSON.parse(readFileSync(".firebaserc", "utf8")),
    );
    if (failures.length) throw new Error(failures.join("\n"));
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/posts?select=id&limit=1`, {
      headers: { apikey: process.env.VITE_SUPABASE_ANON_KEY },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("デモ用キーで投稿を読み取れません");
    console.log("デモの接続先・公開用キー・配信先の照合に成功しました");
  } catch (error) {
    // 通信例外にはURL等が含まれることがあるため、未知の詳細は出力しない。
    console.error(error instanceof Error && !error.cause ? error.message : "配信前の照合に失敗しました");
    process.exitCode = 1;
  }
}
