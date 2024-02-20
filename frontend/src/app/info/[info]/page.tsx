import { fetchAPI } from "../../_utils/strapiApi";
import { InformationPage } from "@apiTypes/information-page/content-types/information-page/information-page";
import { marked } from "marked";
import { notFound } from "next/navigation";

export default async function Home(props: { params: { info: string } }) {
  const pageData: InformationPage[] = (await fetchAPI("/information-pages", { filters: { slug: { $eq: props.params.info } } }))
    .data;

  if (!pageData[0]) return notFound();

  const parsedMarkdown = await marked.parse(pageData[0].attributes.text);
  return (
    <div className="mx-auto w-full max-w-[60rem]">
      <h1 className="mx-auto my-12 w-fit text-3xl font-gigabold">{pageData[0].attributes.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: parsedMarkdown }}></div>
    </div>
  );
}
