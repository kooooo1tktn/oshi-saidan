import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDemoDeployment } from "./demo-deploy-guard.mjs";

// 実在しないキーで検証し、実サービスへの通信や配信は行わない。
const jwt = (role = "anon", ref = "tbdgcoarawanktqytlef") =>
  `test.${Buffer.from(JSON.stringify({ role, ref })).toString("base64url")}.test`;
const env = {
  GITHUB_REF: "refs/heads/main",
  GITHUB_EVENT_NAME: "push",
  VITE_DEMO_MODE: "true",
  VITE_SUPABASE_URL: "https://tbdgcoarawanktqytlef.supabase.co",
  VITE_SUPABASE_ANON_KEY: jwt(),
  FIREBASE_PROJECT_ID: "oshi-saidan",
  FIREBASE_SERVICE_ACCOUNT: JSON.stringify({type: "service_account", project_id: "oshi-saidan", client_email: "test@example.test", private_key: "BEGIN PRIVATE KEY test only"}),
};
const config = { hosting: { site: "oshi-saidan", public: "dist" } };
const rc = { projects: { default: "oshi-saidan" } };

test("期待する設定だけが配信前の照合を通過する", () => {
  assert.deepEqual(validateDemoDeployment(env, config, rc), []);
});
for (const [name, changes] of [
  ["作業ブランチ", { GITHUB_REF: "refs/heads/feature" }],
  ["PRイベント", { GITHUB_EVENT_NAME: "pull_request" }],
  ["通常モード", { VITE_DEMO_MODE: "false" }],
  ["未設定のモード", { VITE_DEMO_MODE: "" }],
  ["個人用の保存先", { VITE_SUPABASE_URL: "https://personal.supabase.co" }],
  ["未設定のキー", { VITE_SUPABASE_ANON_KEY: "" }],
  ["管理用JWT", { VITE_SUPABASE_ANON_KEY: jwt("service_role") }],
  ["別プロジェクトのJWT", { VITE_SUPABASE_ANON_KEY: jwt("anon", "other") }],
  ["管理用secretキー", { VITE_SUPABASE_ANON_KEY: "sb_secret_test-only" }],
  ["別の配信先", { FIREBASE_PROJECT_ID: "other" }],
  ["認証の未設定", { FIREBASE_SERVICE_ACCOUNT: "" }],
  ["別プロジェクトの認証", { FIREBASE_SERVICE_ACCOUNT: JSON.stringify({type:"service_account", project_id:"other"}) }],
]) {
  test(`${name}では配信を拒否する`, () => {
    assert.ok(validateDemoDeployment({ ...env, ...changes }, config, rc).length > 0);
  });
}
test("別サイトや複数サイトへの意図しない配信を拒否する", () => {
  for (const hosting of [{ site: "other", public: "dist" }, [config.hosting], { ...config.hosting, target: "other" }, { ...config.hosting, public: "." }]) {
    assert.ok(validateDemoDeployment(env, {hosting}, rc).length > 0);
  }
  assert.ok(validateDemoDeployment(env, config, {projects:{default:"other"}}).length > 0);
});
test("公開用Publishable keyは通信確認前の形式検査を通過する", () => {
  assert.deepEqual(validateDemoDeployment({...env, VITE_SUPABASE_ANON_KEY:"sb_publishable_test_not_a_real_key"}, config, rc), []);
});
