import { PostResponseDto } from "./PostResponseDto";

export interface PostDetailsResponseDto extends PostResponseDto {
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    user: {
      id: number;
      name: string;
      username: string;
      avatar: string;
    };
  }[];
}
