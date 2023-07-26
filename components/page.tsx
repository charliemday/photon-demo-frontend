import { Card, Text, Title } from "@tremor/react";
import { BASE_URL } from "config";
import { useEffect, useState } from "react";
import type { Prompt } from "./table";
import UsersTable from "./table";

export default function Page() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const url = `${BASE_URL}/prompts/log-prompt/`;
      const response = await fetch(url).then((res) => res.json());
      setPrompts(response);
    };
    fetchPrompts();
  }, []);

  console.log("Prompts", prompts);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Prompt History</Title>
      <Text>Your latest prompts</Text>
      <Card className="mt-6">
        <UsersTable prompts={prompts} />
      </Card>
    </main>
  );
}
