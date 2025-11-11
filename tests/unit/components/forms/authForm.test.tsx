import AuthForm from "@/components/forms/AuthForm"
import ROUTES from "@/constants/routes"
import { SignInSchema, SignUpSchema } from "@/lib/validations"
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks"
import { render, screen } from "@testing-library/react"

import userEvent from "@testing-library/user-event"

const user = userEvent.setup()

describe("AuthForm Component", () => {
    beforeEach(() => {
        resetAllMocks()
    })

    describe("Sign In Form", () => {
        describe("Rendering", () => {
            it("should display all require fields", () => {
                const handleSubmit = jest.fn()

                render(<AuthForm schema={SignInSchema} onSubmit={handleSubmit} defaultValues={{email: "", password: ""}} formType="SIGN_IN" />)

                // Query the fields using label text
                expect(screen.getByLabelText("Email Address")).toBeInTheDocument()
                expect(screen.getByLabelText("Password")).toBeInTheDocument()
                expect(screen.getByRole("button", {name: 'Sign In'})).toBeInTheDocument()
                expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
            })
        })

        describe("Form Validation", () => {
            it("should show validation error for invalid email", async () => {
                const handleSubmit = jest.fn()

                render(<AuthForm schema={SignInSchema} onSubmit={handleSubmit} defaultValues={{email: "", password: ""}} formType="SIGN_IN" />)

                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button")

                await user.type(emailInput, "test@invalid")
                await user.type(passwordInput, "11345566")
                await user.click(submitButton)

                expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument()
                expect(handleSubmit).not.toHaveBeenCalled()
            })

            it("should show validation error for short password", async () => {
                const handleSubmit = jest.fn()

                render(<AuthForm schema={SignInSchema} onSubmit={handleSubmit} defaultValues={{email: "", password: ""}} formType="SIGN_IN" />)

                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button")

                await user.type(emailInput, "valid@email.com")
                await user.type(passwordInput, "113")
                await user.click(submitButton)

                expect(screen.getByText("Password must contain at least 6 characters long.")).toBeInTheDocument()
                expect(handleSubmit).not.toHaveBeenCalled()
            })
        })

        describe("Submission", () => {
            it("should call onSubmit with valid data and proper loading state", async () => {
                const onSubmit = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => {resolve({success: true})}, 100)))

                render(<AuthForm schema={SignInSchema} onSubmit={onSubmit} defaultValues={{email: "", password: ""}} formType="SIGN_IN" />)

                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button")

                await user.type(emailInput, "test@valid.com")
                await user.type(passwordInput, "1134@Pw")
                await user.click(submitButton)

                expect(screen.getByText("Signing In...")).toBeInTheDocument()
                expect(onSubmit).toHaveBeenCalledWith({
                    email: 'test@valid.com',
                    password: '1134@Pw'
                })
            })
        })

        describe("Success Handling", () => {
            it("should show success toast and redirect to home", async () => {
                const onSubmit = jest.fn().mockResolvedValue({success: true})

                render(<AuthForm schema={SignInSchema} onSubmit={onSubmit} defaultValues={{email: "", password: ""}} formType="SIGN_IN" />)

                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button")

                await user.type(emailInput, "test@valid.com")
                await user.type(passwordInput, "1134@Pw")
                await user.click(submitButton)

                expect(mockToast).toHaveBeenCalledWith({title: 'Success', description: "Signed in successfully!"})
                expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.HOME)
            })
        })

        describe("Failure Handling", () => {
            it("should show success toast and redirect to home", async () => {
                const onSubmit = jest.fn().mockResolvedValue({
                    success: false,
                    status: 401,
                    error: { message: 'Invalid credentials'}
                })

                render(<AuthForm schema={SignInSchema} onSubmit={onSubmit} defaultValues={{email: "", password: ""}} formType="SIGN_IN" />)

                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button")

                await user.type(emailInput, "test@valid.com")
                await user.type(passwordInput, "1134@Pw")
                await user.click(submitButton)

                expect(mockToast).toHaveBeenCalledWith({title: 'Error 401', description: "Invalid credentials", variant: 'destructive'})
            })
        })
    })

    describe("Sign Up Form", () => {
        describe("Rendering", () => {
            it("should display all require fields", () => {
                const handleSubmit = jest.fn()

                render(<AuthForm schema={SignUpSchema} onSubmit={handleSubmit} defaultValues={{email: "", name: "", password: "", username: ""}} formType="SIGN_UP"/>)

                // Query the fields using label text
                expect(screen.getByLabelText("Name")).toBeInTheDocument()
                expect(screen.getByLabelText("Username")).toBeInTheDocument()
                expect(screen.getByLabelText("Email Address")).toBeInTheDocument()
                expect(screen.getByLabelText("Password")).toBeInTheDocument()
                expect(screen.getByRole("button", {name: 'Sign Up'})).toBeInTheDocument()
                expect(screen.getByText("Already have an account?")).toBeInTheDocument()
            })
        })

        describe("Form Validation", () => {
            it("should show validation error for form input", async () => {
                const handleSubmit = jest.fn()

                render(<AuthForm schema={SignUpSchema} onSubmit={handleSubmit} defaultValues={{email: "", name: "", password: "", username: ""}} formType="SIGN_UP"/>)

                const nameInput = screen.getByLabelText("Name")
                const usernameInput = screen.getByLabelText("Username")
                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button", {name: 'Sign Up'})

                // invalid data
                await user.type(usernameInput, '@johndoe');
                await user.type(nameInput, 'John Doe');
                await user.type(emailInput, 'test@invalid');
                await user.type(passwordInput, '123');
                await user.click(submitButton);

                expect(screen.getByText('Username can only contain letters, numbers, and underscores.')).toBeInTheDocument();
                expect(screen.getByText('Please provide a valid email address.')).toBeInTheDocument();
                expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
                expect(handleSubmit).not.toHaveBeenCalled();

                // required fields
                await user.clear(usernameInput);
                await user.clear(nameInput);
                await user.clear(emailInput);
                await user.clear(passwordInput);

                expect(screen.getByText('Username must be at least 3 characters long.')).toBeInTheDocument();
                expect(screen.getByText('Name is required.')).toBeInTheDocument();
                expect(screen.getByText('Email is required.')).toBeInTheDocument();
                expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
            })

            it("should show validation error for weak password", async () => {
                const handleSubmit = jest.fn()

                render(<AuthForm schema={SignUpSchema} onSubmit={handleSubmit} defaultValues={{email: "", name: "", password: "", username: ""}} formType="SIGN_UP"/>)

                
                const nameInput = screen.getByLabelText("Name")
                const usernameInput = screen.getByLabelText("Username")
                const emailInput = screen.getByLabelText("Email Address")
                const passwordInput = screen.getByLabelText("Password")
                const submitButton = screen.getByRole("button", {name: 'Sign Up'})

                // Case 1: password without uppercase letters
                await user.type(usernameInput, 'johndoe');
                await user.type(nameInput, 'John Doe');
                await user.type(emailInput, 'johndoe@gmail.com');
                await user.type(passwordInput, '123456');

                await user.click(submitButton);

                expect(screen.getByText("Password must contain at least one uppercase letter.")).toBeInTheDocument()

                // Case 2: password without lowercase letters
                await user.clear(passwordInput)
                await user.type(passwordInput, '1234PW');
                expect(screen.getByText("Password must contain at least one lowercase letter.")).toBeInTheDocument()

                // Case 3: password without special characters
                await user.clear(passwordInput)
                await user.type(passwordInput, '1234Pw');
                expect(screen.getByText("Password must contain at least one special character.")).toBeInTheDocument()
            })
        })
    })
})
