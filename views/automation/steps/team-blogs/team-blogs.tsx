import { useListTeamBlogsQuery } from "api/blog.api";
import { FC, useEffect, useState } from "react";
import { Blog, RootState, Team } from "types";
import { ModalStepWrapper } from "..";

import { useSelector } from "react-redux";
import StepWizard from "react-step-wizard";
import { BlogList } from "./blog-list";
import { BlogOutline } from "./blog-outline";
import { EditBlog } from "./edit-blog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamBlogs: FC<Props> = (props) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: blogData, refetch } = useListTeamBlogsQuery(
    { teamId: activeTeam?.id },
    {
      skip: !activeTeam?.id,
    }
  );

  useEffect(() => {
    if (props.isOpen) {
      refetch();
    }
  }, [props.isOpen, refetch]);

  return (
    <ModalStepWrapper
      {...props}
      contentProps={{
        overflow: "hidden",
      }}
    >
      <StepWizard>
        <BlogList
          blogs={blogData}
          onClick={setSelectedBlog}
          teamName={activeTeam?.name}
        />
        <BlogOutline
          blogSections={selectedBlog?.sections}
          blogTitle={selectedBlog?.title}
        />
        <EditBlog blog={selectedBlog} />
      </StepWizard>
    </ModalStepWrapper>
  );
};
