import QuestionForm from "@/components/forms/QuestionForm"
import { createQuestion } from "@/lib/actions/question.action"
import { MockEditor, mockRouter, mockToast, resetAllMocks } from "@/tests/mocks"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

jest.mock("@/components/editor", () => MockEditor)
jest.mock("@/lib/actions/question.action", () => ({
    createQuestion: jest.fn()
}))

const mockCreateQuestion = createQuestion as jest.MockedFunction<typeof createQuestion>

const user = userEvent.setup()

describe("QuestionForm Component", () => {
    beforeEach(() => {
        resetAllMocks()

        mockCreateQuestion.mockClear()
    })

    describe("Rendering", () => {
        it("should render all form fields", async () => {
            render(<QuestionForm />)

            expect(screen.getByLabelText(/Question Title/i)).toBeInTheDocument()
            expect(await screen.findByLabelText(/Detailed explanation of your problem/i)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(/Add tags/i)).toBeInTheDocument()
            expect(screen.getByRole("button", {name: /Ask A Question/i})).toBeInTheDocument()
        })
    })

    describe("Validation", () => {
        it("Should show validation error when form fields are empty", async () => {
            render(<QuestionForm />)

            const submitBtn = screen.getByRole("button", {name: /Ask A Question/i})

            await user.click(submitBtn)

            expect(await screen.findByText(/Title is required./i)).toBeInTheDocument()
            expect(await screen.findByText(/Body is required./i)).toBeInTheDocument()
            expect(await screen.findByText(/At least one tag is required./i)).toBeInTheDocument()

        })
    })

    describe("Submission", () => {
        it("should submit form successfully with valid data", async () => {
            mockCreateQuestion.mockResolvedValue({success: true, data: {_id: "123"}})

            render(<QuestionForm />)

            // Fill title
            await user.type(screen.getByLabelText(/Question Title/i), "Unit testing title")

            // Fill Question content
            const editorTextArea = await screen.findByTestId("mdx-editor")
            await user.click(editorTextArea)

            const content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ducimus fugit recusandae vitae voluptatibus, eum ea. Pariatur autem tempore quaerat tenetur quas totam aperiam accusamus animi ratione dolores sequi, eaque suscipit sapiente, quo illo. Itaque voluptatibus, deleniti ut magnam quam provident consectetur tenetur beatae cum officiis quaerat magni corporis voluptatum quidem aspernatur? Pariatur itaque illum obcaecati vel quas, labore reiciendis quisquam neque. Deserunt numquam placeat ullam adipisci necessitatibus, hic magni blanditiis voluptates inventore corrupti earum modi eius aliquid consectetur suscipit ratione velit, maxime qui? Ea et minima possimus, asperiores vero laudantium, inventore quae rem recusandae enim cum corrupti tempora molestiae, aut nulla."
            await user.type(editorTextArea, content)

            // Add tags
            const tagInput = screen.getByPlaceholderText(/Add tags/i)
            fireEvent.change(tagInput, {target: {value: "react"}})
            fireEvent.keyDown(tagInput, {key: "Enter"})

            const submitBtn = screen.getByRole("button", {name: /Ask A Question/i})
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(createQuestion).toHaveBeenCalledWith({
                    title: "Unit testing title",
                    content,
                    tags: ["react"]
                })

                expect(mockToast).toHaveBeenCalledWith({
                    title: "Success",
                    description: "Question created successfully!"
                })

                expect(mockRouter.push).toHaveBeenCalledWith("/questions/123")
            })
        })

        it ("should show error toast message in case of failure", async () => {
            mockCreateQuestion.mockResolvedValue({
                success: false,
                status: 400,
                error: { message: 'Something went wrong' },
            })

            render(<QuestionForm />)

            // Fill title
            await user.type(screen.getByLabelText(/Question Title/i), "Unit testing title")

            // Fill Question content
            const editorTextArea = await screen.findByTestId("mdx-editor")
            await user.click(editorTextArea)

            const content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ducimus fugit recusandae vitae voluptatibus, eum ea. Pariatur autem tempore quaerat tenetur quas totam aperiam accusamus animi ratione dolores sequi, eaque suscipit sapiente, quo illo. Itaque voluptatibus, deleniti ut magnam quam provident consectetur tenetur beatae cum officiis quaerat magni corporis voluptatum quidem aspernatur? Pariatur itaque illum obcaecati vel quas, labore reiciendis quisquam neque. Deserunt numquam placeat ullam adipisci necessitatibus, hic magni blanditiis voluptates inventore corrupti earum modi eius aliquid consectetur suscipit ratione velit, maxime qui? Ea et minima possimus, asperiores vero laudantium, inventore quae rem recusandae enim cum corrupti tempora molestiae, aut nulla."
            await user.type(editorTextArea, content)

            // Add tags
            const tagInput = screen.getByPlaceholderText(/Add tags/i)
            fireEvent.change(tagInput, {target: {value: "react"}})
            fireEvent.keyDown(tagInput, {key: "Enter"})

            const submitBtn = screen.getByRole("button", {name: /Ask A Question/i})
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(createQuestion).toHaveBeenCalledWith({
                    title: "Unit testing title",
                    content,
                    tags: ["react"]
                })

                expect(mockToast).toHaveBeenCalledWith({
                    title: "Error 400",
                    description: "Something went wrong",
                    variant: "destructive",
                })
            })
        })
    })
})