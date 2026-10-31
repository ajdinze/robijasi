import { MockPage } from "@/components/mock-page";
import { NewsList } from "@/components/news-list";

export default function NovostiPage() {
  return (
    <MockPage eyebrow="Iz tribine" title="Najnovije." intro="Novosti, aktivnosti i priče iz života Robijaša Zenica 1988.">
      <NewsList />
    </MockPage>
  );
}
