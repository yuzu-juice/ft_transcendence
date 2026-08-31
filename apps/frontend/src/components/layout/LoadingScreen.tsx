// ref: https://zenn.dev/catnose99/articles/19a05103ab9ec7

export const LoadingScreen = () => {
  return (
    <div className="min-h-dvh w-full flex flex-col gap-5 items-center justify-center">
      <div className="flex justify-center">
        <div className="animate-ping h-2 w-2 bg-brand-primary-soft rounded-full"></div>
        <div className="animate-ping h-2 w-2 bg-brand-primary-soft rounded-full mx-4"></div>
        <div className="animate-ping h-2 w-2 bg-brand-primary-soft rounded-full"></div>
      </div>
      <p className="text-md">ログイン中</p>
    </div>
  )
}
