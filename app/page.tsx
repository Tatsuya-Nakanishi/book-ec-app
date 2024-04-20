import Book from "./components/Book";
import { getAllBooks } from "./libs/microcms/client";
import { getServerSession } from "next-auth";
import { BookType } from "./types/types";
import { nextAuthOptions } from "./libs/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const { contents } = await getAllBooks();

  const session = await getServerSession(nextAuthOptions);
  const user: any = session?.user;
  let purchasedIds: string[];
  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" }
    );
    const purchasesData = await response.json();
    purchasedIds = purchasesData.map((purchase: any) => purchase.bookId);
  }
  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book) => (
          <Book
            key={book.id}
            book={book}
            isPurchased={purchasedIds.includes(book.id)}
          />
        ))}
      </main>
    </>
  );
}
