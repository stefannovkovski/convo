import { PostResponseDto } from "./PostResponseDto";

export interface PostDetailsResponseDto extends PostResponseDto {
  replies: PostResponseDto[];
}
