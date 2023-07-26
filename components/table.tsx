import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import { useMemo } from "react";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Prompt {
  id: number;
  prompt: string;
  result: string;
  tokens: string;
  created: string;
}

export default function UsersTable({ prompts }: { prompts: Prompt[] }) {
  const formatTime = useMemo(
    () => (time: string) => {
      const dateObject = new Date(time);
      const formattedDate = dateObject.toISOString().split("T")[0];
      const formattedTime = dateObject.toISOString().split("T")[1].split(".")[0];

      return formattedDate + " " + formattedTime;
    },
    [],
  );

  const formatString = useMemo(
    () => (str: string) => {
      /**
       * Take a string and add an ellipsis if it's longer than 20 characters
       */
      const LIMIT = 50;
      if (str.length > LIMIT) {
        return str.slice(0, LIMIT) + "...";
      }
      return str;
    },
    [],
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Prompt</TableHeaderCell>
          <TableHeaderCell>Result</TableHeaderCell>
          <TableHeaderCell>Tokens Used</TableHeaderCell>
          <TableHeaderCell>Created</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {prompts?.map(({ id, prompt, result, tokens, created }) => (
          <TableRow key={id}>
            <TableCell>{formatString(prompt)}</TableCell>
            <TableCell>
              <Text>{formatString(result)}</Text>
            </TableCell>
            <TableCell>
              <Text>{parseInt(tokens)}</Text>
            </TableCell>
            <TableCell>
              <Text>{formatTime(created)}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
