export interface AbstractShortUrlDto {
  originalUrl: string;
  shortCode: string;
  createdByUsername: string;
  createdAt: Date;
}

export interface ShortUrlDto extends AbstractShortUrlDto {
  id: string;
  createdByUserId: string;
}

export interface SafeShortUrlDto extends AbstractShortUrlDto {}

export interface CreateShortUrlDto {
  originalUrl: string;
} 