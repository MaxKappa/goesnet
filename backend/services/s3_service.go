package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

func UploadFileToS3(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(os.Getenv("AWS_REGION")))
	if err != nil {
		return "", fmt.Errorf("unable to load AWS SDK config, %v", err)
	}
	s3Client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(s3Client)
	bucketName := os.Getenv("S3_BUCKET")
	if bucketName == "" {
		return "", fmt.Errorf("S3_BUCKET non definito")
	}
	ext := filepath.Ext(fileHeader.Filename)
	key := fmt.Sprintf("profile_pictures/%s%s", uuid.New().String(), ext)

	_, err = uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(bucketName),
		Key:         aws.String(key),
		Body:        file,
		ContentType: aws.String(fileHeader.Header.Get("Content-Type")),
		ACL:         "public-read",
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to S3, %v", err)
	}

	fileUrl := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", bucketName, os.Getenv("AWS_REGION"), key)
	return fileUrl, nil
}
