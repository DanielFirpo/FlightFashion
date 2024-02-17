import { Homepage } from "@apiTypes/homepage/content-types/homepage/homepage";
import { fetchAPI, getImageURLBySize } from "@/src/app/_utils/strapiApi";
import Link from "next/link";
import { Button } from "@/src/app/_components/shadcn/button";
import saleIcon from "@/public/sale.png";
import Image from "next/image";

export default async function Home() {
  "use server";

  const pageData: Homepage = (
    await fetchAPI("/homepage", {
      populate:
        "heroImage,leftHalfImage,heroButton,wideImage,saleImage,saleButton",
    })
  ).data;

  // split the hero text into 3 seperate lines so we can style each differently
  const titleSplit = pageData.attributes.heroTitle.split(" ");
  const third = titleSplit.length / 3;
  const firstTitleThird = titleSplit.slice(0, third).join(" ");
  const secondTitleThird = titleSplit.slice(third, 2 * third).join(" ");
  const thirdTitleThird = titleSplit.slice(2 * third).join(" ");

  return (
    <>
      {/* Hero */}
      <div
        className="flex h-auto max-h-screen w-full flex-col items-end justify-between gap-20 rounded-3xl bg-cover bg-center p-7 text-white sm:flex-row"
        style={{
          backgroundImage:
            'url("' +
            getImageURLBySize(pageData.attributes.heroImage.data, "large") +
            '")',
          aspectRatio: "16 / 9",
        }}
      >
        <div className="font-alumniSans font-gigabold xs:text-3xl flex w-full flex-col justify-between text-nowrap text-center sm:text-left sm:text-5xl md:text-7xl xl:text-8xl">
          <div>{firstTitleThird}</div>
          <div className="text-highlightYellow">{secondTitleThird}</div>
          <div>{thirdTitleThird}</div>
        </div>
        <div className="flex w-1/2 max-w-96 flex-col items-end gap-7">
          <div className="text-right text-xs font-bold sm:text-small md:text-lg xl:text-xl">
            {pageData.attributes.heroSubtitle}
          </div>
          <Link
            href={pageData.attributes.heroButton?.data.attributes.href + ""}
          >
            <Button variant="hightlighted" size="lg">
              {pageData.attributes.heroButton?.data.attributes.text}
            </Button>
          </Link>
        </div>
      </div>

      {/* Left Image/Right Text */}
      <div className="mt-14 flex flex-col items-center justify-center gap-14 text-center md:flex-row md:text-left">
        <div className="w-full md:w-1/2">
          <img
            className="rounded-3xl"
            src={getImageURLBySize(
              pageData.attributes.leftHalfImage.data,
              "large",
            )}
          ></img>
        </div>
        <div className="flex w-full flex-col gap-5 md:w-1/2">
          <div className="font-alumniSans font-gigabold text-5xl">
            {pageData.attributes.rightHalfTitle}
          </div>
          <div className="text-sm text-subtitleText">
            {pageData.attributes.rightHalfText}
          </div>
        </div>
      </div>

      {/* Info Columns */}
      <div className="mt-14 flex flex-wrap justify-evenly gap-6">
        <InfoColumn
          title={pageData.attributes.column1Title}
          text={pageData.attributes.column1Text}
          icon="icon-[material-symbols--face-4]"
        ></InfoColumn>
        <InfoColumn
          title={pageData.attributes.column2Title}
          text={pageData.attributes.column2Text}
          icon="icon-[majesticons--creditcard]"
        ></InfoColumn>
        <InfoColumn
          title={pageData.attributes.column3Title}
          text={pageData.attributes.column3Text}
          icon="icon-[ri--shirt-fill]"
        ></InfoColumn>
        <InfoColumn
          title={pageData.attributes.column4Title}
          text={pageData.attributes.column4Text}
          icon="icon-[ic--round-local-shipping]"
        ></InfoColumn>
      </div>

      {/* Wide Image */}
      <div
        className={`font-alumniSans font-gigabold mt-14 flex min-h-44 items-center justify-center rounded-3xl bg-cover text-center text-4xl tracking-wider text-white md:text-7xl`}
        style={{
          backgroundImage:
            'url("' +
            getImageURLBySize(pageData.attributes.wideImage.data, "large") +
            '")',
        }}
      >
        {pageData.attributes.wideImageText}
      </div>

      {/* Sale Image */}
      {pageData.attributes.saleImage?.data ? (
        <div
          className="mt-14 flex justify-end rounded-3xl bg-cover p-7"
          style={{
            backgroundImage:
              'url("' +
              getImageURLBySize(pageData.attributes.saleImage.data, "large") +
              '")',
            aspectRatio: "16 / 9",
          }}
        >
          <div className="flex w-full md:w-1/2 flex-col gap-4">
            <div className="font-alumniSans font-gigabold text-2xl text-center sm:text-left sm:text-3xl md:text-5xl">
              {pageData.attributes.saleImageTitle}
            </div>
            <div className="font-bold text-xs hidden sm:inline-block sm:text-small md:text-medium md:font-normal">{pageData.attributes.saleText}</div>
            <Link
              className="ml-auto hidden sm:inline-block"
              href={pageData.attributes.saleButton?.data.attributes.href + ""}
            >
              <Button size="lg" variant="hightlighted">
                {pageData.attributes.saleButton?.data.attributes.text}
              </Button>
            </Link>
            <div className="relative ml-auto mt-auto min-w-40 hidden lg:inline-block">
              <Image
                src={saleIcon}
                alt="A yellow star"
                className="pointer-events-none absolute h-40 w-40 object-cover object-center fill-destructive-foreground"
              />
              <div className="font-dmSans z-1 relative flex h-40 w-40 flex-col items-center justify-center text-center text-medium font-bold">
                <span>UP TO</span>
                <span
                  style={{ color: "red" }}
                  className="font-gigabold text-xl"
                >
                  {pageData.attributes.saleDiscount}
                </span>
                <span>OFF!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function InfoColumn(props: { title: string; text: string; icon: string }) {
  const { title, text, icon } = props;

  return (
    <div style={{ flexBasis: "23%" }} className="flex w-full min-w-52 flex-col">
      <div className="flex w-fit items-center justify-center rounded-full bg-black p-2">
        <span className={`${icon} h-6 w-6 text-white`}></span>
      </div>
      <div className={"font-dmSans mb-5 mt-6 text-medium font-bold"}>
        {title}
      </div>
      <div className="text-sm text-subtitleText">{text}</div>
    </div>
  );
}
