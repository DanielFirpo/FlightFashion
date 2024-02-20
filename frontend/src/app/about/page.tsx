import Image from "next/image";
import { AboutPage } from "@apiTypes/about-page/content-types/about-page/about-page";
import { fetchAPI, getImageURLBySize } from "../_utils/strapiApi";
import { Button } from "../_components/shadcn/button";
import Link from "next/link";

export default async function Page() {
  const pageData: AboutPage = (
    await fetchAPI("/about-page", {
      populate: "heroImage,leftImage1,leftImage2,link",
    })
  ).data;

  return (
    <>
      <div
        className="mt-14 flex max-h-80 w-full items-center justify-start rounded-3xl bg-cover p-14 text-white"
        style={{
          backgroundImage:
            'url("' +
            getImageURLBySize(pageData.attributes.heroImage.data, "large") +
            '")',
          aspectRatio: "16 / 6",
        }}
      >
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="text-center font-alumniSans text-4xl font-gigabold sm:text-left sm:text-5xl md:text-7xl">
            {pageData.attributes.heroTitle}
          </div>
          <div className="text-center text-sm font-extrabold sm:inline-block sm:text-left sm:text-small md:text-large md:font-normal">
            {pageData.attributes.heroSubtitle}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="mt-28 flex flex-col items-center justify-center gap-14 text-center md:flex-row md:text-left">
          <div className="flex w-full items-center gap-10 flex-col md:flex-row">
            <div className="md:max-w-[30vw] sm:min-w-96">
              <Image
                width={pageData.attributes.leftImage1.data.attributes.width}
                height={pageData.attributes.leftImage1.data.attributes.height}
                alt={
                  pageData.attributes.leftImage1.data.attributes
                    .alternativeText ?? ""
                }
                className="rounded-3xl"
                src={
                  getImageURLBySize(
                    pageData.attributes.leftImage1.data,
                    "large",
                  ) ?? ""
                }
              ></Image>
              <Image
                width={pageData.attributes.leftImage2.data.attributes.width}
                height={pageData.attributes.leftImage2.data.attributes.height}
                alt={
                  pageData.attributes.leftImage2.data.attributes
                    .alternativeText ?? ""
                }
                className="hidden sm:block -mt-14 ml-auto mr-16 w-48 rounded-2xl max-w-[20vw]"
                src={
                  getImageURLBySize(
                    pageData.attributes.leftImage2.data,
                    "small",
                  ) ?? ""
                }
              ></Image>
            </div>
            <div className="flex w-full flex-col gap-5 md:w-1/2">
              <div className="font-alumniSans text-5xl font-gigabold">
                {pageData.attributes.title}
              </div>
              <div className="text-sm text-black">
                {pageData.attributes.description
                  .split("\n")
                  .map((paragraph) => {
                    return (
                      <>
                        {paragraph}
                        <br></br>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 flex w-full items-center justify-center">
        <Link
          href={pageData.attributes.link?.data.attributes.href ?? "/categories"}
        >
          <Button>
            {pageData.attributes.link?.data.attributes.text}
            <span className="icon-[ph--arrow-right-bold] ml-2"></span>
          </Button>
        </Link>
      </div>
    </>
  );
}
