import Link from "next/link";
import OrderInfo from "../../_components/OrderInfo";
import { Button } from "../../_components/shadcn/button";

export default async function Order({ params }: { params: { referenceId: string } }) {
  return (
    <div className="px-12">
      <h1 className="mx-auto my-12 w-fit text-3xl font-gigabold">Order Details</h1>
      <OrderInfo referenceId={params.referenceId}></OrderInfo>
      <div className="mt-24 flex w-full justify-between">
        <Link href="/orders">
          <Button variant="hightlighted" size="sm">
            <span className="icon-[ph--arrow-left-bold] mb-0.5 mr-2 mt-0.5 size-4 align-middle"></span>Go Back to All Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
