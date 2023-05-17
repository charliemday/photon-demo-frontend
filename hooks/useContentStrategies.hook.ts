
import { useSelector } from "react-redux";
import { ContentStrategy, RootState } from "types";

export const useContentStrategies: () => ContentStrategy[] = () => {
    const contentStrategies: ContentStrategy[] = useSelector(
        (state: RootState) => state.contentStrategy.contentStrategies
    );

    return contentStrategies;
};