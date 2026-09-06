import { redirect } from 'next/navigation';

export default function SuccessRedirectPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams && typeof searchParams === 'object'
    ? new URLSearchParams(searchParams as Record<string, string>).toString()
    : '';

  redirect(`/clubs/gfg/hiring/success${query ? `?${query}` : ''}`);
}
