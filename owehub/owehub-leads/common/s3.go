/**************************************************************************
 *	File            : s3.go
 * 	DESCRIPTION     : This file contains common aws s3 helpers used across lead apis
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package common

import (
	"bytes"
	"fmt"

	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"

	log "OWEApp/shared/logger"
)

var s3Client *s3.S3

func getS3Client() (*s3.S3, error) {
	var (
		err  error
		sess *session.Session
	)

	log.EnterFn(0, "getS3Client")
	defer log.ExitFn(0, "getS3Client", err)

	// don't reinitialize if not needed
	if s3Client != nil {
		return s3Client, nil
	}

	config := aws.NewConfig().
		WithCredentials(credentials.NewStaticCredentials(LeadAppCfg.AwsS3AccessKeyId, LeadAppCfg.AwsS3SecretKey, "")).
		WithRegion(LeadAppCfg.AwsS3Region)

	sess, err = session.NewSession(config)

	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	s3Client = svc
	return svc, nil
}

/******************************************************************************
 * FUNCTION:        S3PutObject
 *
 * DESCRIPTION:     This function is used to put object in s3
 * INPUT:			object
 * RETURNS:         error
 ******************************************************************************/
func S3PutObject(path string, object *bytes.Reader) error {
	var (
		err             error
		svc             *s3.S3
		putObjectOutput *s3.PutObjectOutput
	)

	log.EnterFn(0, "S3PutObject")
	defer log.ExitFn(0, "S3PutObject", err)

	svc, err = getS3Client()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get s3 client err: %v", err)
		return err
	}

	putObjectOutput, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(LeadAppCfg.AwsS3Bucket),
		Key:    aws.String(path),
		Body:   aws.ReadSeekCloser(object),
	})

	log.FuncDebugTrace(0, "Put object output: %+v", putObjectOutput)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to put object in s3 err: %v", err)
		return err
	}

	return nil
}

/******************************************************************************
 * FUNCTION:        S3GetObjectUrl
 *
 * DESCRIPTION:     This function is used to get object url from path in s3
 * INPUT:			string
 * RETURNS:         string
 ******************************************************************************/
func S3GetObjectUrl(path string) string {
	return fmt.Sprintf("https://%s.s3.amazonaws.com/%s", LeadAppCfg.AwsS3Bucket, strings.TrimPrefix(path, "/"))
}

/******************************************************************************
 * FUNCTION:        S3ListObjects
 *
 * DESCRIPTION:     This function is used to list objects in s3
 * INPUT:			string
 * RETURNS:         error
 ******************************************************************************/
func S3ListObjects(path string) (*s3.ListObjectsOutput, error) {
	var (
		err               error
		svc               *s3.S3
		listObjectsOutput *s3.ListObjectsOutput
	)

	svc, err = getS3Client()
	if err != nil {
		return nil, err
	}

	listObjectsOutput, err = svc.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(LeadAppCfg.AwsS3Bucket),
		Prefix: aws.String(path),
	})

	if err != nil {
		return nil, err
	}

	return listObjectsOutput, nil
}

/******************************************************************************
 * FUNCTION:        S3DeleteObject
 *
 * DESCRIPTION:     This function is used to delete object in s3
 * INPUT:			string
 * RETURNS:         error
 ******************************************************************************/
func S3DeleteObject(path string) error {
	var (
		err                error
		svc                *s3.S3
		deleteObjectOutput *s3.DeleteObjectOutput
	)

	svc, err = getS3Client()
	if err != nil {
		return err
	}

	deleteObjectOutput, err = svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(LeadAppCfg.AwsS3Bucket),
		Key:    aws.String(path),
	})

	if err != nil {
		return err
	}

	log.FuncDebugTrace(0, "Delete object output: %+v", deleteObjectOutput)
	return nil
}
