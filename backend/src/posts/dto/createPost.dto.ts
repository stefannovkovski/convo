import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreatePostDto{
  @ApiProperty()
  @IsString()
  @MaxLength(280)
  content: string
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quotedPostId?: number;
}