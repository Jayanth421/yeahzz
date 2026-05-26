import Head from "next/head";
import AdminDashboard from "../src/components/AdminDashboard";

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Yeahzz Admin Portal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AdminDashboard />
    </>
  );
}

