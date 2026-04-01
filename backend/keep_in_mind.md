##   Rule of thumb: always check specific errors before general ones.

### Example: When err == sql.ErrNoRows, it's also != nil — so if the general check comes first, it catches it and returns before you ever reach the specific check.

```go
	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}
```
