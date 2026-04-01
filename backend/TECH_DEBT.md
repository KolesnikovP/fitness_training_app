# Tech Debt & Future Improvements

## Error Handling
- [ ] Replace `errors.New("email already exists")` string check in handler with a sentinel error variable (e.g. `var ErrEmailExists = errors.New("email already exists")`) for cleaner, safer error comparison
