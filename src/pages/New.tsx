import {
  Button,
  Container,
  VStack,
  Box,
  HStack,
  Heading,
  FormControl,
  Textarea,
  Input,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPosts } from "../supabase/supabaseFunctions";
import { useState } from "react";

type FormData = {
  image: FileList;
  content: string;
};

export const New = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 投稿ボタン、クリック時の処理
  const onSubmit = async (data: FormData) => {
    try {
      await createPosts(data.image[0], data.content);
      navigate("/");
    } catch(error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <>
      <Container>
        <VStack>
          <Heading>新規投稿</Heading>
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack>
                <FormControl isInvalid={!!errors.image}>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: "画像は必須です" })}
                  />
                  <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.content}>
                  <Textarea
                    placeholder="何を投稿しますか？"
                    {...register("content", {
                      required: "説明文の入力は必須です",
                    })}
                  />
                  <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                </FormControl>
                <HStack>
                  <Button type="button" as={Link} to="/">
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    投稿
                  </Button>
                </HStack>
                {errorMessage && (
                  <Alert status="error">
                    <AlertIcon />
                    投稿に失敗しました。<br/>
                    {errorMessage}
                  </Alert>
                )}
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
