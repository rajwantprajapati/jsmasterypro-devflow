import AnswerForm from "@/components/forms/AnswerForm"
import { createAnswer } from "@/lib/actions/answer.action"
import { api } from "@/lib/api"
import { MockEditor, mockSession, mockToast, mockUseSession, resetAllMocks } from "@/tests/mocks"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const user = userEvent.setup()

jest.mock("@/components/editor", () => MockEditor)

jest.mock("@/lib/actions/answer.action", () => ({
    createAnswer: jest.fn()
}))

jest.mock("@/lib/api", () => ({
    api: { ai: { getAnswer: jest.fn() } }
}))

const mockCreateAnswer = createAnswer as jest.MockedFunction<typeof createAnswer>
const mockApiAiAnswer = api.ai.getAnswer as jest.MockedFunction<typeof api.ai.getAnswer>

describe("AnswerForm Component", () => {
    beforeEach(() => {
        resetAllMocks()
    })

    describe("AI Generation", () => {
        // it ("should generate an AI answer for an authenticated user", async () => {
        //     mockUseSession.mockReturnValue({
        //         data: mockSession,
        //         status: "authenticated",
        //         update: jest.fn()
        //     })

        //     mockApiAiAnswer.mockResolvedValue({
        //         success: true,
        //         data: "This is a generated answer from AI."
        //     })

        //     render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content"/>)

        //     await user.click(screen.getByRole("button", {name: /Generate AI Answer/i}))
            
        //     expect(mockApiAiAnswer).toHaveBeenCalledWith(
        //         "Test Question",
        //         "Test Content",
        //     )

        //     expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        //         title: "Success",
        //         description: "AI generated answers has been generated"
        //     }))
        // })

        it("should not generate AI answer for unauthenticated user", async () => {
            mockUseSession.mockReturnValue({
                data: null,
                status: "unauthenticated",
                update: jest.fn()
            })

            render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content"/>)

            await user.click(screen.getByRole("button", {name: /Generate AI Answer/i}))

            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                title: "Please log in",
                description: "You need to be logged in to use this feature"
            }))
        })
    })

    describe("Submission", () => {
        it("should submit answer successfully with valid data", async () => {
            mockCreateAnswer.mockResolvedValue({success: true})

            render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content"/>)

            const editorTextArea = await screen.findByTestId("mdx-editor")
            // await user.click(editorTextArea)
            await user.type(editorTextArea, "This is a test answer.".repeat(10))

            await user.click(screen.getByRole("button", {name: /Post Answer/i}))

            expect(mockCreateAnswer).toHaveBeenCalledWith({
                questionId: "123",
                content: "This is a test answer.".repeat(10)
            })

            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                title: "Answer posted successfully",
                description: "Your answer has been posted successfully."
            }))
        })

        it("should disable submit button when form is submitting", async () => {
            mockUseSession.mockReturnValue({
                data: mockSession,
                status: "authenticated",
                update: jest.fn()
            })

            mockCreateAnswer.mockImplementation(() => {
                return new Promise(() => {})
            })
            mockApiAiAnswer.mockImplementation(() => {
                return new Promise(() => {})
            })

            render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content"/>)

            const editorTextArea = await screen.findByTestId("mdx-editor")
            // await user.click(editorTextArea)
            await user.type(editorTextArea, "This is a test answer.".repeat(10))

            const submitBtn = screen.getByRole("button", {name: /Post Answer/i})
            await user.click(submitBtn)

            await waitFor(() => {
                expect(submitBtn).toBeDisabled()

                expect(screen.getByText(/Posting.../i)).toBeInTheDocument()
            })
        })
    })
})