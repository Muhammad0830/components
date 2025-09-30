"use client";
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";

const defaultData = [
  {
    title: "Card 1",
    id: 1,
    column: "column1",
  },
  {
    title: "Card 2",
    id: 2,
    column: "column3",
  },
  {
    title: "Card 3",
    id: 3,
    column: "column2",
  },
  {
    title: "Card 4",
    id: 4,
    column: "column1",
  },
  {
    title: "Card 5",
    id: 5,
    column: "column3",
  },
  {
    title: "Card 6",
    id: 6,
    column: "column1",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen text-white bg-black">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] =
    useState<{ title: string; id: number; column: string }[]>(defaultData);

  return (
    <div className="flex min-h-screen h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Column 1"
        headingColor="text-red-500"
        column={"column1"}
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Column 2"
        headingColor="text-green-500"
        column={"column2"}
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Column 3"
        headingColor="text-blue-500"
        column={"column3"}
        cards={cards}
        setCards={setCards}
      />
      <DeleteBox setCards={setCards} />
    </div>
  );
};

const Column = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}: {
  title: string;
  headingColor: string;
  column: string;
  cards: { title: string; id: number; column: string }[];
  setCards: React.Dispatch<
    React.SetStateAction<{ title: string; id: number; column: string }[]>
  >;
}) => {
  const [active, setActive] = useState(false);
  const filteredCards = cards.filter(
    (card: { title: string; column: string; id: number }) =>
      card.column === column
  );

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: Element[]
  ) => {
    const DisatanceOffset = 50;
    const el = indicators.reduce(
      // eslint-disable-next-line
      (closest: any, child: any) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DisatanceOffset);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const clearHighlights = (els?: Element[]) => {
    const indicators = els || getIndicators();

    // eslint-disable-next-line
    indicators.forEach((el: any) => {
      el.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
    console.log("el", el);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    card: { title: string; id: number; column: string }
  ) => {
    e.dataTransfer.setData("cardId", card.id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setActive(false);
    clearHighlights();

    const cardId = e.dataTransfer.getData("cardId");

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || -1;

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((card) => card.id === Number(cardId));
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== Number(cardId));

      const moveToBack = before === -1;

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          !active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map(
          (card: { title: string; column: string; id: number }) => (
            <Card key={card.id} {...card} handleDragStart={handleDragStart} />
          )
        )}
        <DropIndicator beforeId={-1} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({
  title,
  column,
  id,
  handleDragStart,
}: {
  title: string;
  column: string;
  id: number;
  handleDragStart: (
    e: any, // eslint-disable-line
    card: { title: string; id: number; column: string }
  ) => void;
}) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id.toString()}
        draggable={true}
        onDragStart={(e: DragEvent) =>
          handleDragStart(e, { title, id, column })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({
  beforeId,
  column,
}: {
  beforeId: number;
  column: string;
}) => {
  return (
    <div
      data-before={beforeId || -1}
      data-column={column}
      className="h-0.5 w-full bg-violet-600 opacity-0"
    />
  );
};

const DeleteBox = ({
  setCards,
}: {
  setCards: React.Dispatch<
    React.SetStateAction<{ title: string; id: number; column: string }[]>
  >;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");

    setCards((prev) => prev.filter((card) => card.id !== Number(cardId)));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-re-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? (
        <Trash2 className="w-6 h-6 text-red-500 animate-bounce" />
      ) : (
        <Trash2 className="w-6 h-6" />
      )}
    </div>
  );
};

const AddCard = ({
  column,
  setCards,
}: {
  column: string;
  setCards: React.Dispatch<
    React.SetStateAction<{ title: string; id: number; column: string }[]>
  >;
}) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text,
      id: Math.random() * 1000,
    };

    setCards((prev) => [...prev, newCard]);
    setText("");
    setAdding(false);
  };

  return (
    <motion.div layout>
      {adding ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new text..."
            className="w-full rounded border border-violet-500 bg-violet-500/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0F"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setText("");
              }}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50 "
            >
              Close
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 flex gap-1.5 items-center rounded bg-neutral-50 text-neutral-950  text-xs transition-colors hover:bg-neutral-300 "
            >
              <span>Add</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <Plus className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default Page;
