package errors

import (
	"errors"
	"fmt"
)

// 1. Sentinel errors for comparison
var (
	ErrNotFound     = errors.New("not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrInvalidInput = errors.New("invalid input")
)

// 2. Custom error types
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation failed for %s: %s", e.Field, e.Message)
}

// 3. Explicit Error Returns and Error wrapping
func processUser(id string) error {
    // Explicit return example
	user, err := getUser(id)
	if err != nil {
		return fmt.Errorf("process user failed: %w", err)
	}
    _ = user
	return nil
}

// 4. Unwrap errors Example
func handleDetailedError(err error) {
    if err != nil {
        var valErr *ValidationError
        if errors.As(err, &valErr) {
            fmt.Printf("Validation error: %s\n", valErr.Field)
        } else if errors.Is(err, ErrNotFound) {
            fmt.Println("Not found error handled")
        }
    }
}

// Placeholder for getUser
func getUser(id string) (interface{}, error) {
    if id == "" {
        return nil, ErrInvalidInput
    }
    return nil, nil
}
