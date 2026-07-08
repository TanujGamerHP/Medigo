import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Benefits of GLP-1 weight loss medications',
    description: 'Blog Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'benefits-of-glp1-medications',
    description: 'URL slug',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 'Full article text details here...',
    description: 'Content body',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 'Weight Loss', description: 'Category name' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Dr. Sarah Jenkins', description: 'Author name' })
  @IsString()
  author: string;

  @ApiProperty({
    example: 'https://example.com/blog-hero.jpg',
    description: 'Featured image URL',
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;
}
