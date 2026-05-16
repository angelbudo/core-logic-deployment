import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { Link } from "@/lib/router-shim";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trophy, Star, Flame, WalletCards, X } from "lucide-react";
import { fetchLeaderboard, type LeaderboardEntry, type LeaderboardKind } from "@/lib/leaderboards";

function Loading() {
  return <div className="py-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
}

function Board({ kind }: { kind: LeaderboardKind }) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetchLeaderboard(kind).then((e) => { if (alive) setEntries(e); });
    return () => { alive = false; };
  }, [kind]);
  if (!entries) return <Loading />;
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">Encara no hi ha jugadors classificats.</p>;
  }
  return (
    <div className="avatar-scroll max-h-[55vh] overflow-y-auto pr-2 space-y-1.5">
      {entries.map((e) => {
        const label = e.profile.username ?? "Jugador anònim";
        const games = e.stats.wins + e.stats.losses;
        const kindMeta = {
          level: { icon: <Star className="w-4 h-4" />, value: e.stats.level, className: "text-orange-500", style: undefined as CSSProperties | undefined },
          games: { icon: <WalletCards className="w-4 h-4" />, value: games, className: "", style: { color: "#5b8a3c" } as CSSProperties },
          wins: { icon: <Trophy className="w-4 h-4" />, value: e.stats.wins, className: "text-primary", style: undefined },
          streak: { icon: <Flame className="w-4 h-4" />, value: e.stats.max_streak, className: "text-orange-500", style: undefined },
        }[kind];
        return (
          <Link key={e.profile.user_id} to={`/perfil/${e.profile.user_id}`} className="flex items-center gap-2 rounded-md border border-primary/25 p-2 text-neutral-900 bg-stone-200 hover:bg-stone-300 transition -mr-[8px] mx-0 ml-0">
            <div className="flex items-center min-w-0 flex-1 -my-[5px] -mt-[10px] gap-[5px] mx-0 ml-0">
              <span className="w-7 text-center font-bold text-neutral-900">{e.rank}</span>
              <div className="min-w-0">
                <div className={`font-medium truncate ${e.profile.username ? "" : "italic"}`}>{label}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold leading-none">
                  <span className="inline-flex items-center gap-0.5 text-orange-500" title="Nivell">
                    <Star className="w-3.5 h-3.5" /> {e.stats.level}
                  </span>
                  <span className="inline-flex items-center gap-0.5" style={{ color: "#5b8a3c" }} title="Partides">
                    <WalletCards className="w-3.5 h-3.5" /> {games}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-primary" title="Victòries">
                    <Trophy className="w-3.5 h-3.5" /> {e.stats.wins}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-destructive" title="Derrotes">
                    <X className="w-3.5 h-3.5" /> {e.stats.losses}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-orange-500" title="Ratxa màx.">
                    <Flame className="w-3.5 h-3.5" /> {e.stats.max_streak}
                  </span>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 font-bold text-sm shrink-0 ${kindMeta.className}`} style={kindMeta.style}>
              {kindMeta.icon} {kindMeta.value}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function ClassificacionsDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-gold font-title font-black italic">Classificacions</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="level">
          <TabsList className="inline-flex w-auto h-auto gap-1 -mx-[3px] ml-0 -mr-[3px]">
            <TabsTrigger value="level" className="text-accent data-[state=active]:text-accent py-1.5 text-xs gap-1 px-[6px] mx-0"><Star className="w-3.5 h-3.5 shrink-0" />Nivell</TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-background py-1.5 text-xs gap-1 px-[6px] mx-0" style={{ color: "#93C572" }}><WalletCards className="w-3.5 h-3.5 shrink-0" />Partides</TabsTrigger>
            <TabsTrigger value="wins" className="text-primary data-[state=active]:text-primary py-1.5 text-xs gap-1 px-[6px] mx-0"><Trophy className="w-3.5 h-3.5 shrink-0" />Victòries</TabsTrigger>
            <TabsTrigger value="streak" className="text-orange-500 data-[state=active]:text-orange-500 py-1.5 text-xs gap-1 px-[6px] mx-0"><Flame className="w-3.5 h-3.5 shrink-0" />Ratxa</TabsTrigger>
          </TabsList>
          <TabsContent value="level" className="mt-3"><Board kind="level" /></TabsContent>
          <TabsContent value="games" className="mt-3"><Board kind="games" /></TabsContent>
          <TabsContent value="wins" className="mt-3"><Board kind="wins" /></TabsContent>
          <TabsContent value="streak" className="mt-3"><Board kind="streak" /></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}