interface Props {
  params: Promise<{ txnid: string }>;
}

export default async function Page({ params }: Props) {
  const { txnid } = await params;

  return <>{txnid}</>;
}
