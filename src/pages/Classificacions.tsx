import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router-shim";
import { ClientOnly } from "@/components/ClientOnly";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Trophy, Star, Flame, WalletCards, X } from "lucide-react";
import { fetchLeaderboard, type LeaderboardEntry, type LeaderboardKind } from "@/lib/leaderboards";

function Loading() {
  return <main className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></main>;
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
    <div className="space-y-1.5">
      {entries.map((e) => {
    const label = e.profile.username
      ? e.profile.username
      : "Jugador anònim";
    const games = e.stats.wins + e.stats.losses;
        return (
          <Link
            key={e.profile.user_id}
            to={`/perfil/${e.profile.user_id}`}
            className="w-full flex items-center justify-between gap-2 rounded-md border p-2 text-left hover:bg-background/60 transition"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="w-7 text-center font-bold text-muted-foreground">{e.rank}</span>
              <div className="min-w-0">
                <div className={`font-medium truncate ${e.profile.username ? "" : "italic text-muted-foreground"}`}>{label}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold leading-none">
                  <span className="inline-flex items-center gap-0.5 text-orange-500" title="Nivell">
                    <Star className="w-3.5 h-3.5" /> {e.stats.level}
                  </span>
                  <span className="inline-flex items-center gap-0.5" style={{ color: "#93C572" }} title="Partides">
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
          </Link>
        );
      })}
    </div>
  );
}

function Inner() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto pb-24">
      <header className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/perfil")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Tornar
        </Button>
        <h1 className="text-xl font-bold">Classificacions</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top jugadors</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wins">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="wins"><Trophy className="w-4 h-4 mr-1" />Victòries</TabsTrigger>
              <TabsTrigger value="level"><Star className="w-4 h-4 mr-1" />Nivell</TabsTrigger>
              <TabsTrigger value="streak"><Flame className="w-4 h-4 mr-1" />Ratxa</TabsTrigger>
            </TabsList>
            <TabsContent value="wins" className="mt-3"><Board kind="wins" /></TabsContent>
            <TabsContent value="level" className="mt-3"><Board kind="level" /></TabsContent>
            <TabsContent value="streak" className="mt-3"><Board kind="streak" /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

export default function Classificacions() {
  return <ClientOnly fallback={<Loading />}><Inner /></ClientOnly>;
}