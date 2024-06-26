import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../libs/next-auth/options";
import { getDetailBook } from "../libs/microcms/client";
import { BookType, Purchase, User } from "../types/types";
import PurchaseProduct from "../components/PurchaseProduct";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
  );
  const data = await response.json();

  // // 各購入履歴に対してmicroCMSから詳細情報を取得
  const detailBooks = await Promise.all(
    data.map(async (purchase: Purchase) => {
      console.log(purchase.bookId);
      const res = await getDetailBook(purchase.bookId);
      console.log(res);
      return await getDetailBook(purchase.bookId);
    })
  );
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {detailBooks.map((detailBook: BookType) => (
          <PurchaseProduct key={detailBook.id} detailBook={detailBook} />
        ))}
      </div>
    </div>
  );
}
