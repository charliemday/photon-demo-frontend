
import { useSelector } from "react-redux";
import { ContentStrategy, RootState } from "types";

export const useActiveContentStrategy: () => ContentStrategy = () => {
    const activeContentStrategy: ContentStrategy = useSelector(
        (state: RootState) => state.contentStrategy.activeContentStrategy
    );

    return activeContentStrategy;
};