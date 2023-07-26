export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className=" bg-gray-50 p-8"
      style={{
        height: "100vh",
        paddingLeft: "200px",
      }}
    >
      <div className="h-screen border-black p-10">{children}</div>
    </div>
  );
}
