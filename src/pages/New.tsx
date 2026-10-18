import {
  AspectRatio,
  Box,
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Alert,
  AlertIcon,
  Image,
  HStack,
  Flex
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPosts } from "../supabase/supabaseFunctions";
import { useState } from "react";
import { isDemoMode } from "../config/demo";
import { DemoNotice } from "../components/DemoNotice";

type FormData = {
  image: FileList;
  content: string;
};

export const New = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset
  } = useForm<FormData>({ mode: "onBlur" });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    if (isDemoMode) {
      return;
    }
    try {
      await createPosts(data.image[0], data.content);
      reset();
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files === null) return;
    const image = e.target.files[0];
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
  };

  return (
    <Box maxW="1100px" mx="auto" px={{ base: 4, lg: 12 }} py={10}>
      <Text
        fontFamily="heading"
        fontSize="20px"
        fontWeight="600"
        color="#1A0840"
        mb={8}
        textAlign="center"
      >
        新しい投稿
      </Text>

      {/* Form card */}
      <Box
        bg="rgba(255,255,255,0.72)"
        style={{ backdropFilter: "blur(12px)" }}
        border="1px solid"
        borderColor="rgba(200,170,255,0.45)"
        borderRadius="2xl"
        p={{ base: 4, md: 9 }}
        maxW="560px"
        boxShadow="0 4px 24px rgba(100,70,200,0.10)"
        mx="auto"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={5} align="stretch">
            {isDemoMode && <DemoNotice />}
            {/* Image upload */}
            <FormControl id="post-image" isInvalid={!!errors.image}>
              <FormLabel
                fontFamily="heading"
                fontSize="13px"
                fontWeight="600"
                color="#6650A0"
                mb={2}
              >
                投稿画像
              </FormLabel>
              <Box
                border="2px dashed rgba(200,170,255,0.55)"
                borderRadius="20px"
                bg="rgba(200,170,255,0.05)"
                position="relative"
                overflow="hidden"
                cursor="pointer"
                _focusWithin={{ outline: "2px solid #6650A0", outlineOffset: "3px" }}
              >
                {imagePreview ? (
                  <AspectRatio ratio={16 / 9}>
                    <Image src={imagePreview} alt="選択した投稿画像のプレビュー" objectFit="cover" />
                  </AspectRatio>
                ) : (
                  <Flex h={{ base: "220px", md: "300px" }} align="center" justify="center">
                    <Text fontFamily="heading" fontSize="14px" color="#B0A0C8">
                      ここにドロップまたはクリック
                    </Text>
                  </Flex>
                )}
                <Box
                  as="input"
                  type="file"
                  id="post-image"
                  accept="image/*"
                  position="absolute"
                  inset={0}
                  opacity={0}
                  cursor="pointer"
                  {...register("image", {
                    required: "画像は必須です",
                    onChange: handleImageChange,
                  })}
                />
              </Box>
              <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
            </FormControl>
            {/* Content */}
            <FormControl id="post-content" isInvalid={!!errors.content}>
              <FormLabel
                fontFamily="heading"
                fontSize="13px"
                fontWeight="600"
                color="#6650A0"
                mb={2}
              >
                気持ち・メモ
              </FormLabel>
              <Textarea
                placeholder="今日は推しと何があった？"
                rows={5}
                bg="rgba(255,255,255,0.65)"
                style={{ backdropFilter: "blur(8px)" }}
                border="1px solid"
                borderColor="rgba(200,170,255,0.45)"
                borderRadius="20px"
                fontFamily="body"
                fontSize="14px"
                color="#1A0840"
                _placeholder={{ color: "#B0A0C8" }}
                _focus={{
                  borderColor: "#FFB0D8",
                  boxShadow: "0 0 0 3px rgba(255,110,180,0.12)",
                  outline: "none",
                }}
                {...register("content", { required: "説明文の入力は必須です" })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <HStack spacing={4} justify="center" width="100%">
              {/* キャンセル */}
              <Button
                type="button"
                onClick={() => navigate("/")}
                bg="#E4DFF0"
                color="#6650A0"
                border="1px solid"
                borderColor="rgba(200,170,255,0.45)"
                borderRadius="full"
                fontFamily="heading"
                fontWeight="600"
                fontSize="16px"
                py={6}
                _hover={{ bg: "#C8BFE0" }}
                flex={1}
              >
                キャンセル
              </Button>
              {/* Submit */}
              <Button
                type="submit"
                isDisabled={isDemoMode || !isValid || isSubmitting}
                isLoading={isSubmitting}
                bg="#FF6EB4"
                color="white"
                borderRadius="full"
                fontFamily="heading"
                fontWeight="600"
                fontSize="16px"
                py={6}
                _hover={{ bg: "#DD3888" }}
                _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                flex={1}
              >
                投稿する ✦
              </Button>
            </HStack>
            {errorMessage && (
              <Alert status="error" borderRadius="xl">
                <AlertIcon />
                投稿に失敗しました。{errorMessage}
              </Alert>
            )}
          </VStack>
        </form>
      </Box>
    </Box>
  );
};
