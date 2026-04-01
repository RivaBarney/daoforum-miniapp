import Image from "next/image";

type ForumHeaderProps = {
  title: string;
  subtitle: string;
};

export function ForumHeader({ title, subtitle }: ForumHeaderProps) {
  return (
    <header className="forum-header">
      <div className="forum-header__badge">Civic Debate Board</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="forum-header__scene">
        <Image
          src="/scene-daoforum.svg"
          alt="DAOForum chamber scene"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 560px"
        />
      </div>
    </header>
  );
}
