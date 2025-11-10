import { Button } from '@/components/ui/button'
import {fireEvent, render, screen} from '@testing-library/react'

describe('Button Component - TDD Approach', () => { 
    it("should render a button with text", () => {
        render(<Button>Click Me</Button>)

        const buttonEl = screen.getByRole("button")

        expect(buttonEl).toBeInTheDocument()
        expect(buttonEl).toHaveTextContent("Click Me")
    })

    it("should call onCLick function when button is called", () => {
        const onClick = jest.fn()

        render(<Button onClick={onClick}>Click Me</Button>)

        const buttonEl = screen.getByRole("button")
        fireEvent.click(buttonEl)
        expect(onClick).toHaveBeenCalled()
    })

    it ("should render the button with correct variant", () => {
        render(<Button variant="destructive">Click Me</Button>)

        expect(screen.getByText("Click Me")).toHaveClass("bg-destructive") 
    })

    it ("should render the button with correct disabled state", () => {
        render(<Button disabled>Click Me</Button>)

        expect(screen.getByText("Click Me")).toHaveAttribute("disabled")
    })
 })