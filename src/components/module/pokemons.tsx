import { PokeType } from "../../types/pokemon";
import Image from "next/image";
import Button from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import DoneModal from "./modal/done-modal";
import { GetGridNumByPokemonLength } from "../../lib/module/pokemon";
import fixedNames from "../../lib/fixed-name";

type Props = {
  pokemons: PokeType[];
  isEdit: boolean;
  isShare?: boolean;
  setUserPoke?: Dispatch<SetStateAction<PokeType[]>> | undefined;
};

const Pokemons = ({ pokemons, isEdit, isShare, setUserPoke }: Props) => {
  const f = fixedNames;
  const [isOpen, setIsOpen] = useState(false);
  const [removePoke, setRemovePoke] = useState<PokeType>();
  const [selectPoke, setSelectPoke] = useState<PokeType[]>(pokemons);

  const removePokemon = ({ name, image }: PokeType) => {
    setIsOpen(true);
    setRemovePoke({ name, image });
  };

  useMemo(() => {
    setSelectPoke(pokemons);
  }, [pokemons]);

  const gridNum: number = GetGridNumByPokemonLength(pokemons);

  return (
    <>
      {!isShare && (
        <p className="py-3 text-lg font-medium sm:text-xl">
          {isEdit ? f.FAVORITE_POKE_MAX : f.FAVORITE_POKE}
        </p>
      )}
      <div
        className={`grid grid-cols-${gridNum} mb-10 items-center justify-items-center gap-2 rounded-xl bg-white/90 px-4 pt-1 pb-4 text-black sm:gap-6 sm:px-10`}
      >
        {selectPoke.map(({ name, image }) => (
          <div key={name}>
            {isEdit ? (
              <Button
                key={name}
                type="button"
                onClick={() => removePokemon({ name, image })}
                className="transition duration-200 ease-in-out md:hover:opacity-50"
              >
                <Image
                  src={image}
                  alt={name}
                  width={70}
                  height={70}
                  className="md:h-20 md:w-20"
                ></Image>
                <p className="text-xs font-semibold sm:text-lg">{name}</p>
              </Button>
            ) : (
              <div key={name}>
                <Image
                  src={image}
                  alt={name}
                  width={70}
                  height={70}
                  className="md:h-24 md:w-24"
                ></Image>
                <p className="text-xs font-semibold sm:text-base">{name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <DoneModal
        setIsOpen={setIsOpen}
        setSelectPoke={setSelectPoke}
        setUserPoke={setUserPoke}
        isOpen={isOpen}
        isMyPage={true}
        pokemon={removePoke}
        isPokeEdit={isEdit}
      ></DoneModal>
    </>
  );
};

export default Pokemons;
