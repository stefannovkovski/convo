import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength} from 'class-validator';

export class CreatePostDto{

  @ApiProperty()
  @IsString()
  @MaxLength(280)
  content: string
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}