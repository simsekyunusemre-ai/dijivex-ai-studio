export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h1 className="text-2xl font-bold mb-4">Dijivex Studio Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700"
        />

        <button className="w-full py-3 rounded-xl bg-white text-black font-semibold">
          Login
        </button>
      </div>
    </main>
  );
}
