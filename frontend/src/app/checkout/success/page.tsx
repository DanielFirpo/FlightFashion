import OrderInfo from "../../_components/OrderInfo";

export default async function CheckoutSuccess({ searchParams }: { searchParams: any }) {
  return (
    <div className="sm:px-12">
      <h1 className="mx-auto my-12 w-fit text-3xl font-gigabold">Checkout Success</h1>
      <OrderInfo referenceId={searchParams.referenceId}></OrderInfo>
      <p className="mt-20 text-center text-lg">
        Thank your for your purchase! Your order will be shipped and delivered within a 14 days.
      </p>
    </div>
  );
}
