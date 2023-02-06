import Layout from "../../components/layout/layout";
import UserGuard from "../../guards/user-guard";
import Link from "next/link";
import { useAuth } from "../../context/auth";
import { useState } from "react";
import Pokemons from "../../components/module/pokemons";
import { GetUserInfo } from "../../lib/module/user";
import { UserInfo } from "../../types/user";
import { useRouter } from "next/router";
import Image from "next/image";
import Meta from "../../components/layout/meta";
import WithdrawModal from "../../components/module/modal/withdraw-modal";
import Button from "../../components/ui/button";
import fixedNames from "../../lib/fixed-name";

const Mypage = () => {
  const user = useAuth();
  const f = fixedNames;
  const router = useRouter();
  const actions = [
    {
      label: f.BTN_SHARE,
      link: `/user/${user?.id}`,
    },
    {
      label: f.BTN_EDIT,
      link: "/user/edit",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  let userInfo: UserInfo | null = null;

  const userId: string | undefined = user?.id;
  userInfo = GetUserInfo(userId);

  if (!userInfo) return null;

  if (!user) {
    router.replace("/");
  }

  const mb =
    userInfo?.pokemons && userInfo.pokemons.length > 0 ? "mb-36" : "mb-42";

  return (
    <UserGuard>
      {(user) => (
        <Layout>
          <Meta title={userInfo?.name + f.USER_PAGE} />
          <div
            className={`mx-6 ${mb} rounded-3xl bg-white bg-opacity-20 px-8 py-4 text-center font-dot text-white md:mt-8`}
          >
            <div className="mb-16 font-medium">
              <p className="mt-6 text-xl md:text-3xl">{userInfo?.name}</p>
              <div className="my-8 flex items-center justify-center">
                {actions.map((action) => (
                  <Link
                    href={action.link}
                    key={action.label}
                    className="mx-2 flex items-center rounded-full px-3 py-2 text-lg font-medium hover:text-teal-200 md:text-2xl"
                  >
                    <span>▽{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            {userInfo?.comment && (
              <div className="">
                <p className="whitespace-pre-line text-lg italic md:text-xl">
                  {userInfo?.comment}
                </p>
              </div>
            )}
            <div className="my-6">
              {userInfo?.pokemons && userInfo.pokemons.length > 0 ? (
                <Pokemons
                  pokemons={userInfo.pokemons}
                  isEdit={false}
                ></Pokemons>
              ) : (
                <div className="grid grid-rows-2 gap-5">
                  <Image
                    src="/images/pochama.png"
                    height={80}
                    width={80}
                    alt="poke"
                    className="mt-2 justify-self-center brightness-110"
                  />
                  <p className="text-base font-medium md:text-lg">
                    {f.NON_POKE}
                  </p>
                </div>
              )}
            </div>
            <div className="mb-8 flex justify-center hover:text-teal-200">
              <Button onClick={() => setIsOpen(true)}>{f.BTN_BYE}</Button>
            </div>
          </div>
          <WithdrawModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </Layout>
      )}
    </UserGuard>
  );
};

export default Mypage;
