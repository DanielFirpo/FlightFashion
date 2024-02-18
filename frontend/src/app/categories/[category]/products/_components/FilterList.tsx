import { ProductTag } from "@apiTypes/product-tag/content-types/product-tag/product-tag";
import { ProductsPage } from "@apiTypes/products-page/content-types/products-page/products-page";
import { useEffect } from "react";

export default function Product(props: {
  pageData: ProductsPage;
  selectedTags: string[] | null;
  setSelectedTags: Function;
  resetPagination: Function;
}) {
  const tagsCombined = props.pageData.attributes.filter_list_1.data.concat(
    props.pageData.attributes.filter_list_2.data,
    props.pageData.attributes.filter_list_3.data,
  );

  const filterTitleClasses =
    "font-dmSans text-md font-semibold text-subtitleText";

  return (
    <div className="md:absolute md:h-[calc(32rem+14rem)] md:w-[17rem] overflow-y-auto rounded-3xl bg-white p-5">
      <div className="mb-5 flex gap-4 font-dmSans text-xl font-semibold">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
          <span className="icon-[mdi--filter] text-white"></span>
        </div>
        <div>Filter by Tags</div>
      </div>
      <div className="flex flex-col">
        <div className={filterTitleClasses}>Applied Filters</div>
        <div className="flex min-h-16 md:min-h-32 flex-wrap">
          {props.selectedTags?.length ? (
            <TagList
              tags={tagsCombined.filter((tag) =>
                props.selectedTags?.includes(tag.attributes.name),
              )}
              withX={true}
            ></TagList>
          ) : (
            <div
              className={`mt-3 flex max-h-8 w-fit cursor-pointer items-center justify-center rounded-full border-1.5 border-none border-black bg-black p-1.5 px-4 text-small font-semibold text-white`}
            >
              No Filters
            </div>
          )}
        </div>
      </div>
      <div>
        <div className={filterTitleClasses}>
          {props.pageData.attributes.filterTitle1}
        </div>
        <TagList tags={props.pageData.attributes.filter_list_1.data}></TagList>
      </div>
      <div>
        <div className={filterTitleClasses}>
          {props.pageData.attributes.filterTitle2}
        </div>
        <TagList tags={props.pageData.attributes.filter_list_2.data}></TagList>
      </div>
      <div>
        <div className={filterTitleClasses}>
          {props.pageData.attributes.filterTitle3}
        </div>
        <TagList tags={props.pageData.attributes.filter_list_3.data}></TagList>
      </div>
    </div>
  );

  function TagList(tagListProps: { tags: ProductTag[]; withX?: boolean }) {
    return (
      <div className="mb-9 mt-3 flex flex-wrap gap-3 overflow-x-auto">
        {tagListProps.tags.map((tag) => (
          <div
            key={tag.attributes.displayName}
            onClick={() => {
              props.resetPagination();
              //first tag
              const tagName = tag.attributes.name;
              if (!props.selectedTags?.length) {
                props.setSelectedTags([tagName]);
                return;
              }

              function listIncludesTag(tagList: ProductTag[], tag: string) {
                return (
                  tagList.filter((listTag) => listTag.attributes.name === tag)
                    .length > 0
                );
              }

              //toggle tag selected
              if (props.selectedTags.includes(tagName)) {
                props.setSelectedTags(
                  props.selectedTags.filter((tag) => tag !== tagName),
                );
              } else {
                //Do not allow multiple active tag filters from the same filter category
                //if there are already some selected tags of the same tag category, replace them with new tag
                [
                  props.pageData.attributes.filter_list_1.data,
                  props.pageData.attributes.filter_list_2.data,
                  props.pageData.attributes.filter_list_3.data,
                ].forEach((filterList) => {
                  if (listIncludesTag(filterList, tagName)) {
                    const list = props.selectedTags!.filter(
                      (selectedTag) =>
                        !listIncludesTag(filterList, selectedTag),
                    );
                    list.push(tagName);
                    props.setSelectedTags(list);
                  }
                });
              }
            }}
            className={`flex max-h-8 w-fit cursor-pointer items-center justify-center rounded-full border-1.5 border-black p-1.5 px-4 text-small font-semibold ${props.selectedTags?.includes(tag.attributes.name) ? "border-none bg-black text-white" : ""}`}
          >
            {tag.attributes.displayName}
            {tagListProps.withX && (
              <div className="ml-2 flex items-center justify-center">
                <span className="icon-[material-symbols-light--close] h-4 w-4 text-white"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
