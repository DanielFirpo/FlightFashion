import { Button } from "@/src/app/_components/shadcn/button";

export default function Product(props: {
  page: number;
  totalPages: number;
  setPage: Function;
}) {
  return (
    <div className="mx-auto mt-24 flex w-fit items-center justify-center rounded-lg bg-white p-2">
      <Button
        size="sm"
        onClick={() => {
          if (props.page > 1) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            props.setPage(props.page - 1);
          }
        }}
      >
        Prev
      </Button>
      <div className="mx-3 flex gap-3">
        <div className="hidden gap-1 md:flex">
          {props.page > 4 && (
            <>
              <PageButton page={1}></PageButton>
              <span className="font-bold tracking-widest">...</span>
            </>
          )}
          {props.page > 2 && <PageButton page={props.page - 2}></PageButton>}
          {props.page > 1 && <PageButton page={props.page - 1}></PageButton>}
        </div>
        <div className="rounded-sm border-1 border-black bg-highlightYellow px-3 py-1 font-bold">
          {props.page}
        </div>
        <div className="hidden gap-1 md:flex">
          {props.totalPages >= props.page + 1 && (
            <PageButton page={props.page + 1}></PageButton>
          )}
          {props.totalPages >= props.page + 2 && (
            <PageButton page={props.page + 2}></PageButton>
          )}
          {props.page < props.totalPages - 4 &&
            props.page != props.totalPages && (
              <>
                <span className="font-bold tracking-widest">...</span>
                <PageButton page={props.totalPages}></PageButton>
              </>
            )}
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => {
          if (props.page < props.totalPages) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            props.setPage(props.page + 1);
          }
        }}
      >
        Next
      </Button>
    </div>
  );

  function PageButton(page: { page: number }) {
    return (
      <div
        onClick={() => props.setPage(page.page)}
        className="flex min-w-9 cursor-pointer items-center justify-center rounded-sm border-1 border-black py-1 font-bold hover:border-transparent hover:bg-highlightYellow"
      >
        {page.page}
      </div>
    );
  }
}
