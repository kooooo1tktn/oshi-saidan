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
  FormErrorMessage
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPosts } from "../supabase/supabaseFunctions";

type FormData = {
  image: FileList;
  content: string;
};

export const New = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onBlur" });

  const navigate = useNavigate();

  // 投稿ボタン、クリック時の処理
  const onSubmit = async (data: FormData) => {
    await createPosts(data.image, data.content);
    navigate("/");
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
                  <Button type="submit" disabled={!isValid}>
                    投稿
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
