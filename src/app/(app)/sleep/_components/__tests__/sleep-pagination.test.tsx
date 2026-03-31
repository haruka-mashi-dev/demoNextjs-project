import { queryByRole, render, screen } from "@testing-library/react";
import SleepPagination from "../sleep-pagination";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn()
    }))
}));

describe("SleepPagination", () => {
    it("ぺージネーション表示なし", () => {
        render(<SleepPagination currentPage={1} hasNextPage={false} />);
        expect(screen.queryByRole("button",{ name: /古い/})).not.toBeInTheDocument();
        expect(screen.queryByRole("button",{ name: /新しい/})).not.toBeInTheDocument();
    });

    it("新しいのみ表示", () => {
        render(<SleepPagination currentPage={2} hasNextPage={false} />);
        expect(screen.queryByRole("button",{ name: /古い/})).not.toBeInTheDocument();
        expect(screen.queryByRole("button",{ name: /新しい/})).toBeInTheDocument();
    });

    it("古いのみ表示", () => {
        render(<SleepPagination currentPage={1} hasNextPage={true} />);
        expect(screen.queryByRole("button",{ name: /古い/})).toBeInTheDocument();
        expect(screen.queryByRole("button",{ name: /新しい/})).not.toBeInTheDocument();
    });

    it("ページネーション両方表示", () => {
        render(<SleepPagination currentPage={2} hasNextPage={true} />);
        expect(screen.queryByRole("button",{ name: /古い/})).toBeInTheDocument();
        expect(screen.queryByRole("button",{ name: /新しい/})).toBeInTheDocument();
    });
});

