
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

export const useActiveTeam: () => Team = () => {
    const activeTeam: Team = useSelector(
        (state: RootState) => state.team.activeTeam
    );
    return activeTeam;
};