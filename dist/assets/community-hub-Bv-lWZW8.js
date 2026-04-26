const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/community-lunar-Uo-1Su-Q.js","assets/features-lazy-bN0WDG2L.js","assets/community-solar-FU_xwlLn.js"])))=>i.map(i=>d[i]);
import{_ as w}from"./features-lazy-bN0WDG2L.js";const Se=window.AppSupabase||null;window.CommunitySupabase=Se;const c={_sb:null,_uid:null,_subs:{},_heartbeatTimer:null,async init(){if(this._sb=window.AppSupabase||Se,!this._sb)return console.error("[CommunityDB] CommunitySupabase not ready — window.AppSupabase is null"),!1;const{data:{user:e},error:t}=await this._sb.auth.getUser();return t||!e?(console.error("[CommunityDB] No authenticated user:",t==null?void 0:t.message),!1):(this._uid=e.id,!0)},get userId(){return this._uid},get ready(){return!!(this._sb&&this._uid)},_err(e,t){console.error(`[CommunityDB] ${e}:`,(t==null?void 0:t.message)??t)},_profileSelect:"id, name, emoji, avatar_url",_ago(e){return new Date(Date.now()-e).toISOString()},_todayUTC(){const e=new Date;return e.setUTCHours(0,0,0,0),e.toISOString()},async getMyProfile(){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("profiles").select("*").eq("id",this._uid).single();return t?(this._err("getMyProfile",t),null):e},async getProfile(e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("profiles").select("id, name, emoji, avatar_url, inspiration, community_status, community_role, total_sessions, total_minutes, gifts_given, birthday, country").eq("id",e).single();return i?(this._err("getProfile",i),null):t},_parseProgress(e){var i,o,n,r,l,a;const t=typeof e=="string"?JSON.parse(e):e;return{xp:t.xp??0,karma:t.karma??0,level:t.level??1,badges:t.badges??[],unlockedFeatures:t.unlockedFeatures??[],streak:((i=t.streaks)==null?void 0:i.current)??((o=t.streak)==null?void 0:o.current)??0,longestStreak:((n=t.streaks)==null?void 0:n.longest)??0,totalSessions:((r=t.stats)==null?void 0:r.totalSessions)??0,totalMeditations:((l=t.stats)==null?void 0:l.totalMeditations)??0,totalReadings:((a=t.stats)==null?void 0:a.totalReadings)??0,totalTarotSpreads:t.totalTarotSpreads??0,totalJournalEntries:t.totalJournalEntries??0,totalWellnessRuns:t.totalWellnessRuns??0,totalHappinessViews:t.totalHappinessViews??0}},async getUserProgress(e){if(!this.ready)return null;try{const{data:t,error:i}=await this._sb.from("user_progress").select("payload").eq("user_id",e).single();return i||!t?null:this._parseProgress(t.payload)}catch(t){return this._err("getUserProgress",t),null}},getOwnGamificationState(){var t;const e=(t=window.app)==null?void 0:t.gamification;return e?this._parseProgress(e.state??e):null},async uploadAvatar(e){if(!this.ready)return null;try{const t=e.name.split(".").pop().toLowerCase()||"jpg",i=`avatars/${this._uid}.${t}`,{error:o}=await this._sb.storage.from("community-avatars").upload(i,e,{upsert:!0,contentType:e.type});if(o)return this._err("uploadAvatar upload",o),null;const{data:n}=this._sb.storage.from("community-avatars").getPublicUrl(i),r=n==null?void 0:n.publicUrl;if(!r)return null;const l=`${r}?t=${Date.now()}`;return await this.updateProfile({avatar_url:l})?l:null}catch(t){return this._err("uploadAvatar",t),null}},async updateProfile(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("profiles").update({...e,updated_at:new Date().toISOString()}).eq("id",this._uid);return t?(this._err("updateProfile",t),!1):!0},async setPresence(e="online",t="✨ Available",i=null){if(!this.ready)return!1;const o=new Date().toISOString(),{error:n}=await this._sb.from("community_presence").upsert({user_id:this._uid,status:e,activity:t,room_id:i,last_seen:o,updated_at:o},{onConflict:"user_id"});return n&&this._err("setPresence",n),!n},async setOffline(){return this.setPresence("offline","💤 Offline",null)},async getActiveMembers(){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!1});return t?(this._err("getActiveMembers",t),[]):e||[]},async getRoomParticipants(e){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).or(`room_id.eq.${e},is_phantom.eq.true`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!0});return i?(this._err("getRoomParticipants",i),[]):t||[]},subscribeToPresence(e){return this._subs.presence&&this._subs.presence.unsubscribe(),this._subs.presence=this._sb.channel("community-presence").on("postgres_changes",{event:"*",schema:"public",table:"community_presence"},async()=>e(await this.getActiveMembers())).subscribe(),this._subs.presence},startHeartbeat(e=6e4){this.stopHeartbeat(),this._heartbeatTimer=setInterval(async()=>{var i,o,n;if(!this.ready)return;const t=(i=typeof Core<"u"?Core:window.Core)==null?void 0:i.state;await this.setPresence(((o=t==null?void 0:t.currentUser)==null?void 0:o.status)||"online",((n=t==null?void 0:t.currentUser)==null?void 0:n.activity)||"✨ Available",(t==null?void 0:t.currentRoom)||null)},e),window.addEventListener("beforeunload",()=>this._cleanup())},stopHeartbeat(){this._heartbeatTimer&&(clearInterval(this._heartbeatTimer),this._heartbeatTimer=null)},_reflectionSelect:"id, content, appreciation_count, created_at, profiles ( id, name, emoji, avatar_url )",async getReflections(e=30){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("reflections").select(this._reflectionSelect).order("created_at",{ascending:!1}).limit(e);return i?(this._err("getReflections",i),[]):t||[]},async postReflection(e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("reflections").insert({user_id:this._uid,content:e}).select(this._reflectionSelect).single();return i?(this._err("postReflection",i),null):t},async deleteReflection(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("reflections").delete().eq("id",e);return t?(this._err("deleteReflection",t),!1):!0},async updateReflection(e,t){if(!this.ready)return!1;const{error:i}=await this._sb.from("reflections").update({content:t}).eq("id",e).eq("user_id",this._uid);return i?(this._err("updateReflection",i),!1):!0},subscribeToReflections(e){return this._subs.reflections&&this._subs.reflections.unsubscribe(),this._subs.reflections=this._sb.channel("community-reflections").on("postgres_changes",{event:"INSERT",schema:"public",table:"reflections"},async({new:t})=>{const{data:i}=await this._sb.from("reflections").select(this._reflectionSelect).eq("id",t.id).single();i&&e(i)}).subscribe(),this._subs.reflections},async getMyAppreciations(){if(!this.ready)return new Set;const{data:e,error:t}=await this._sb.from("appreciations").select("reflection_id").eq("user_id",this._uid);return t?(this._err("getMyAppreciations",t),new Set):new Set(e.map(i=>i.reflection_id))},async toggleAppreciation(e,t){if(!this.ready)return null;if(t){const{error:i}=await this._sb.from("appreciations").delete().eq("user_id",this._uid).eq("reflection_id",e);return i?(this._err("removeAppreciation",i),null):{appreciated:!1}}else{const{error:i}=await this._sb.from("appreciations").insert({user_id:this._uid,reflection_id:e});return i?(this._err("addAppreciation",i),null):{appreciated:!0}}},async getReflectionCount(e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("reflections").select("appreciation_count").eq("id",e).single();return i?(this._err("getReflectionCount",i),null):(t==null?void 0:t.appreciation_count)??null},async getMyUserAppreciations(){if(!this.ready)return new Set;const{data:e,error:t}=await this._sb.from("user_appreciations").select("appreciated_user_id").eq("user_id",this._uid);return t?(this._err("getMyUserAppreciations",t),new Set):new Set(e.map(i=>i.appreciated_user_id))},async toggleUserAppreciation(e,t){if(!this.ready)return null;if(t){const{error:i}=await this._sb.from("user_appreciations").delete().eq("user_id",this._uid).eq("appreciated_user_id",e);return i?(this._err("removeUserAppreciation",i),null):{appreciated:!1}}else{const{error:i}=await this._sb.from("user_appreciations").insert({user_id:this._uid,appreciated_user_id:e});return i?(this._err("addUserAppreciation",i),null):{appreciated:!0}}},async getUserAppreciationCount(e){if(!this.ready)return 0;const{count:t,error:i}=await this._sb.from("user_appreciations").select("*",{count:"exact",head:!0}).eq("appreciated_user_id",e);return i?(this._err("getUserAppreciationCount",i),0):t||0},_roomMsgSelect:"id, message, created_at, profiles ( id, name, emoji, avatar_url )",async getRoomMessages(e,t=50){if(!this.ready)return[];const{data:i,error:o}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("room_id",e).order("created_at",{ascending:!0}).limit(t);return o?(this._err("getRoomMessages",o),[]):i||[]},async sendRoomMessage(e,t){if(!this.ready)return null;const{data:i,error:o}=await this._sb.from("room_messages").insert({user_id:this._uid,room_id:e,message:t}).select(this._roomMsgSelect).single();return o?(this._err("sendRoomMessage",o),null):i},subscribeToRoomChat(e,t){const i=`room-${e}`;return this._subs[i]&&this._subs[i].unsubscribe(),this._subs[i]=this._sb.channel(`room-chat-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_messages",filter:`room_id=eq.${e}`},async({new:o})=>{const{data:n}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("id",o.id).single();n&&t(n)}).subscribe(),this._subs[i]},unsubscribeFromRoomChat(e){this._unsub(`room-${e}`)},async sendWhisper(e,t){if(!this.ready)return null;const{data:i,error:o}=await this._sb.from("whispers").insert({sender_id:this._uid,recipient_id:e,message:t}).select().single();return o?(this._err("sendWhisper",o),null):i},async getWhispers(e){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("whispers").select(`
                id, message, read, created_at,
                sender:profiles!whispers_sender_id_fkey ( id, name, emoji ),
                recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji )
            `).or(`and(sender_id.eq.${this._uid},recipient_id.eq.${e}),and(sender_id.eq.${e},recipient_id.eq.${this._uid})`).order("created_at",{ascending:!0});return i?(this._err("getWhispers",i),[]):t||[]},async markWhisperRead(e){this.ready&&await this._sb.from("whispers").update({read:!0}).eq("id",e)},async markConversationRead(e){if(!this.ready)return;const{error:t}=await this._sb.from("whispers").update({read:!0}).eq("recipient_id",this._uid).eq("sender_id",e).eq("read",!1);t&&this._err("markConversationRead",t)},async getWhisperInbox(){if(!this.ready)return[];try{const{data:e,error:t}=await this._sb.from("whispers").select(`
                    id, message, read, created_at, sender_id, recipient_id,
                    sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url ),
                    recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji, avatar_url )
                `).or(`sender_id.eq.${this._uid},recipient_id.eq.${this._uid}`).order("created_at",{ascending:!1}).limit(200);if(t)return this._err("getWhisperInbox",t),[];const i={};for(const o of e||[]){const n=o.sender_id===this._uid?o.recipient_id:o.sender_id,r=o.sender_id===this._uid?o.recipient:o.sender;i[n]||(i[n]={partnerId:n,partner:r,lastMessage:o.message,lastAt:o.created_at,unread:0}),o.recipient_id===this._uid&&!o.read&&i[n].unread++}return Object.values(i).sort((o,n)=>new Date(n.lastAt)-new Date(o.lastAt))}catch(e){return this._err("getWhisperInbox",e),[]}},async getUnreadWhisperCount(){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("whispers").select("id",{count:"exact",head:!0}).eq("recipient_id",this._uid).eq("read",!1);return t?0:e||0},subscribeToWhispers(e){return this._subs.whispersFg&&this._subs.whispersFg.unsubscribe(),this._subs.whispersFg=this._sb.channel("my-whispers-fg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:t})=>{const{data:i}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",t.id).single();i&&e(i)}).subscribe(),this._subs.whispersFg},subscribeToWhispersBackground(e){return this._subs.whispersBg&&this._subs.whispersBg.unsubscribe(),this._subs.whispersBg=this._sb.channel("my-whispers-bg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:t})=>{const{data:i}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",t.id).single();i&&e(i)}).subscribe(),this._subs.whispersBg},async submitReport(e,t,i=""){if(!this.ready)return!1;const{error:o}=await this._sb.from("reports").insert({reporter_id:this._uid,reported_user_id:e,reason:t,details:i});return o?(this._err("submitReport",o),!1):!0},async blockUser(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("blocked_users").insert({user_id:this._uid,blocked_user_id:e});return t?(this._err("blockUser",t),!1):!0},async getBlockedUsers(){if(!this.ready)return new Set;const{data:e,error:t}=await this._sb.from("blocked_users").select("blocked_user_id").eq("user_id",this._uid);return t?new Set:new Set(e.map(i=>i.blocked_user_id))},async getUserByName(e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("profiles").select("id, name").ilike("name",e).single();return i?(this._err("getUserByName",i),null):t},async getOwnFullProgress(){if(!this.ready)return null;try{const{data:e,error:t}=await this._sb.from("user_progress").select("payload").eq("user_id",this._uid).single();if(t||!e)return null;const i=typeof e.payload=="string"?JSON.parse(e.payload):e.payload;return{journalEntries:i.journalEntries||[],energyEntries:i.energyEntries||[],gratitudeEntries:i.gratitudeEntries||[],flipEntries:i.flipEntries||[],tarotReadings:i.tarotReadings||[],meditationEntries:i.meditationEntries||[]}}catch(e){return this._err("getOwnFullProgress",e),null}},async getRoomBlessings(e){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",e).order("created_at",{ascending:!1});return i?(this._err("getRoomBlessings",i),[]):t||[]},async blessRoom(e){if(!this.ready)return{status:"error"};const{data:t,error:i}=await this._sb.rpc("bless_room_with_cooldown",{p_room_id:e,p_cooldown_seconds:60});if(i)return this._err("blessRoom rpc",i),{status:"error"};if(t==="cooldown")return{status:"cooldown"};if(t!=="ok")return{status:"error"};const{data:o,error:n}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",e).eq("user_id",this._uid).single();return n?(this._err("blessRoom fetch",n),{status:"ok",data:null}):{status:"ok",data:o}},subscribeToBlessings(e,t){const i=`bless-${e}`;this._subs[i]&&this._subs[i].unsubscribe();const o=async({new:n})=>{if(!(n!=null&&n.user_id))return;const{data:r}=await this._sb.from("profiles").select("name, avatar_url, emoji").eq("id",n.user_id).single();t({roomId:e,userId:n.user_id,name:(r==null?void 0:r.name)||"A member",avatarUrl:(r==null?void 0:r.avatar_url)||"",emoji:(r==null?void 0:r.emoji)||""})};return this._subs[i]=this._sb.channel(i).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_blessings",filter:`room_id=eq.${e}`},o).on("postgres_changes",{event:"UPDATE",schema:"public",table:"room_blessings",filter:`room_id=eq.${e}`},o).subscribe(),this._subs[i]},unsubscribeFromBlessings(e){this._unsub(`bless-${e}`)},async getAppSettings(e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("app_settings").select("value").eq("key",e).single();return i?(this._err("getAppSettings",i),null):(t==null?void 0:t.value)??null},async saveAppSettings(e,t){if(!this.ready)return!1;const{error:i}=await this._sb.from("app_settings").upsert({key:e,value:t,updated_at:new Date().toISOString()},{onConflict:"key"});return i?(this._err("saveAppSettings",i),!1):!0},async logRoomEntry(e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("room_entries").insert({user_id:this._uid,room_id:e}).select("id").single();return i?(this._err("logRoomEntry",i),null):(t==null?void 0:t.id)||null},async logRoomExit(e){if(!e||!this.ready)return;const{data:t}=await this._sb.from("room_entries").select("entered_at").eq("id",e).single();if(!t)return;const i=Math.round((Date.now()-new Date(t.entered_at).getTime())/1e3);await this._sb.from("room_entries").update({left_at:new Date().toISOString(),duration_seconds:i}).eq("id",e)},async broadcastMessage(e,t){if(!this.ready||!(e!=null&&e.length))return{sent:0,failed:0};const i=e.map(r=>({sender_id:this._uid,recipient_id:r,message:t})),{data:o,error:n}=await this._sb.from("whispers").insert(i).select("id");return n?(this._err("broadcastMessage",n),{sent:0,failed:e.length}):{sent:(o==null?void 0:o.length)||0,failed:e.length-((o==null?void 0:o.length)||0)}},async getAdminNotifications(e=50){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("admin_notifications").select("*").order("created_at",{ascending:!1}).limit(e);return i?(this._err("getAdminNotifications",i),[]):t||[]},async markNotificationRead(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("admin_notifications").update({read:!0}).eq("id",e);return t?(this._err("markNotificationRead",t),!1):!0},async markAllNotificationsRead(){if(!this.ready)return!1;const{error:e}=await this._sb.from("admin_notifications").update({read:!0}).eq("read",!1);return e?(this._err("markAllNotificationsRead",e),!1):!0},async getUnreadNotificationCount(){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1);return t?(this._err("getUnreadNotificationCount",t),0):e||0},async getAdminMemberStats(){if(!this.ready)return{};const[e,t,i]=await Promise.all([this._sb.from("profiles").select("*",{count:"exact",head:!0}),this._sb.from("profiles").select("*",{count:"exact",head:!0}).gte("updated_at",this._ago(10080*6e4)),this._sb.from("community_presence").select("*",{count:"exact",head:!0}).neq("status","offline").gte("last_seen",this._ago(5*6e4))]);return{total:e.count||0,newThisWeek:t.count||0,onlineNow:i.count||0}},async getAdminEngagementStats(){if(!this.ready)return{};const e=this._todayUTC(),[t,i,o,n]=await Promise.all([this._sb.from("reflections").select("*",{count:"exact",head:!0}).gte("created_at",e),this._sb.from("reflections").select("*",{count:"exact",head:!0}),this._sb.from("whispers").select("*",{count:"exact",head:!0}).gte("created_at",e),this._sb.from("appreciations").select("*",{count:"exact",head:!0}).gte("created_at",e)]);return{reflectionsToday:t.count||0,reflectionsTotal:i.count||0,whispersToday:o.count||0,appreciationsToday:n.count||0}},async getLeaderboard(){if(!this.ready)return{xp:[],karma:[]};const{data:e,error:t}=await this._sb.from("user_progress").select("user_id, payload->xp, payload->karma, payload->level").limit(50);if(t)return this._err("getLeaderboard",t),{xp:[],karma:[]};const i=(e||[]).map(a=>a.user_id);if(!i.length)return{xp:[],karma:[]};const{data:o}=await this._sb.from("profiles").select("id, name, emoji, avatar_url").in("id",i),n=Object.fromEntries((o||[]).map(a=>[a.id,a])),r=(e||[]).filter(a=>n[a.user_id]).map(a=>({user_id:a.user_id,profiles:n[a.user_id],payload:{xp:a.xp??0,karma:a.karma??0,level:a.level??1}})),l=a=>[...r].sort((s,d)=>{var u,m;return(((u=d.payload)==null?void 0:u[a])||0)-(((m=s.payload)==null?void 0:m[a])||0)}).slice(0,3);return{xp:l("xp"),karma:l("karma")}},async getRoomUsageToday(){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("room_entries").select("room_id, duration_seconds").gte("entered_at",this._todayUTC());if(t)return this._err("getRoomUsageToday",t),[];const i={};for(const o of e||[])i[o.room_id]||(i[o.room_id]={room_id:o.room_id,entries:0,totalSeconds:0}),i[o.room_id].entries++,i[o.room_id].totalSeconds+=o.duration_seconds||0;return Object.values(i).sort((o,n)=>n.entries-o.entries)},async getPushSubscriptionCount(){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("push_subscriptions").select("*",{count:"exact",head:!0});return t?(this._err("getPushSubscriptionCount",t),0):e||0},async getRetentionSignals(){if(!this.ready)return{quietMembers:[],streakMembers:[]};const[e,t,i]=await Promise.all([this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(10080*6e4)).neq("status","offline"),this._sb.from("community_presence").select("user_id").gte("last_seen",this._ago(336*60*6e4)).lt("last_seen",this._ago(10080*6e4)),this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(4320*6e4))]),o=new Set((e.data||[]).map(a=>a.user_id)),r=[...new Set((t.data||[]).map(a=>a.user_id))].filter(a=>!o.has(a)).slice(0,5),l=(i.data||[]).filter(a=>a.profiles).slice(0,5).map(a=>{var s,d;return{user_id:a.user_id,name:(s=a.profiles)==null?void 0:s.name,emoji:(d=a.profiles)==null?void 0:d.emoji}});return{quietMembers:r,streakMembers:l}},async getSafetyStats(){if(!this.ready)return{};const[e,t,i]=await Promise.all([this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("type","report").gte("created_at",this._ago(10080*6e4)),this._sb.from("blocked_users").select("*",{count:"exact",head:!0}),this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1)]);return{reportsThisWeek:e.count||0,blockedTotal:t.count||0,unreadNotifs:i.count||0}},async getRecentReflectionsAdmin(e=5){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("reflections").select("id, content, created_at, user_id, profiles!reflections_user_id_fkey(id, name, emoji, avatar_url)").order("created_at",{ascending:!1}).limit(e);if(i){this._err("getRecentReflectionsAdmin",i);const{data:o}=await this._sb.from("reflections").select("id, content, created_at, author_id").order("created_at",{ascending:!1}).limit(e);return o||[]}return t||[]},async adminUpdateGamification(e,{xpDelta:t=0,karmaDelta:i=0,unlockFeature:o=null,badgeId:n=null,badgeName:r=null,badgeIcon:l="🏅",badgeRarity:a="common",badgeXp:s=0,badgeDesc:d=""}={}){if(!this.ready)return!1;try{const{error:u}=await this._sb.rpc("update_user_gamification",{target_user_id:e,xp_delta:t,karma_delta:i,unlock_feature:o,badge_id:n,badge_name:r,badge_icon:l,badge_rarity:a,badge_xp:s,badge_desc:d});if(u)throw new Error(u.message);return!0}catch(u){return this._err("adminUpdateGamification",u),!1}},_unsub(e){this._subs[e]&&(this._subs[e].unsubscribe(),delete this._subs[e])},unsubscribeAll(){for(const e of Object.values(this._subs))try{e.unsubscribe()}catch{}this._subs={}},async _cleanup(){this.stopHeartbeat(),await this.setOffline(),this.unsubscribeAll()}};window.addEventListener("pagehide",()=>c._cleanup());window.CommunityDB=c;const S='xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"',fe={user:`<svg ${S}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,aries:`<svg ${S}><path d="M12 20V10c0-3.31-2.69-6-6-6"/><path d="M12 20V10c0-3.31 2.69-6 6-6"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg>`,taurus:`<svg ${S}><circle cx="12" cy="14" r="7"/><path d="M5 9C5 6 7 3 12 3s7 3 7 6"/><path d="M9 9H4"/><path d="M20 9h-5"/></svg>`,gemini:`<svg ${S}><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="8" y1="4" x2="16" y2="4"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,cancer:`<svg ${S}><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M4 8c0-2 1-4 4-4"/><path d="M20 16c0 2-1 4-4 4"/></svg>`,leo:`<svg ${S}><circle cx="8" cy="8" r="4"/><path d="M12 8h4a4 4 0 0 1 0 8h-1"/><path d="M15 16v4"/></svg>`,virgo:`<svg ${S}><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4V8a6 6 0 0 0-12 0"/><path d="M15 16v4"/><path d="M17 16l1.5 4"/></svg>`,libra:`<svg ${S}><line x1="3" y1="20" x2="21" y2="20"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 16a6 6 0 0 0 12 0"/></svg>`,scorpio:`<svg ${S}><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><line x1="18" y1="4" x2="18" y2="12"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4"/><polyline points="15 9 18 12 21 9"/></svg>`,sagittarius:`<svg ${S}><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/><line x1="5" y1="19" x2="12" y2="12"/></svg>`,capricorn:`<svg ${S}><path d="M6 20V8a4 4 0 0 1 8 0v4a4 4 0 0 0 4 4h0"/><path d="M18 16l2 2-2 2"/></svg>`,aquarius:`<svg ${S}><path d="M3 10c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/><path d="M3 16c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/></svg>`,pisces:`<svg ${S}><line x1="12" y1="4" x2="12" y2="20"/><path d="M4 8c2 2 4 4 8 4s6-2 8-4"/><path d="M4 16c2-2 4-4 8-4s6 2 8 4"/></svg>`,meditation:`<svg ${S}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3"/><path d="M12 12l3 3"/><path d="M6 17c0-2 2-4 6-4s6 2 6 4"/></svg>`,moon:`<svg ${S}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,sun:`<svg ${S}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,star:`<svg ${S}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,crystal:`<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4z"/></svg>`,butterfly:`<svg ${S}><path d="M12 22V12"/><path d="M12 12C12 12 8 9 4 10c-3 1-3 5 0 6 2 1 5 0 8-4z"/><path d="M12 12C12 12 16 9 20 10c3 1 3 5 0 6-2 1-5 0-8-4z"/><circle cx="12" cy="5" r="2"/></svg>`,leaf:`<svg ${S}><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/><path d="M22 2C11 2 2 11 2 22c5.5 0 11-2.5 14.5-6S22 7.5 22 2z"/></svg>`,flower:`<svg ${S}><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>`,om:`<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 0 8 0"/><circle cx="12" cy="8" r="1"/></svg>`,clover:`<svg ${S}><path d="M12 12c-2-2.5-4-3-6-2s-3 4-1 6 5 2 7-4z"/><path d="M12 12c2-2.5 4-3 6-2s3 4 1 6-5 2-7-4z"/><path d="M12 12c-2.5-2-3-4-2-6s4-3 6-1-2 5-4 7z"/><path d="M12 12c2.5-2 3-4 2-6s-4-3-6-1 2 5 4 7z"/><line x1="12" y1="12" x2="12" y2="22"/></svg>`},Pe={"👤":"user","♈️":"aries","♉️":"taurus","♊️":"gemini","♋️":"cancer","♌️":"leo","♍️":"virgo","♎️":"libra","♏️":"scorpio","♐️":"sagittarius","♑️":"capricorn","♒️":"aquarius","♓️":"pisces","🧘‍♀️":"meditation","🌙":"moon","☀️":"sun","🌟":"star","🔮":"crystal","🦋":"butterfly","🌿":"leaf","🌸":"flower","🕉️":"om","🍀":"clover"};function xe(e){return fe[e]||fe[Pe[e]]||fe.user}const ze=["🏅","🎖️","🌟","👑","🧪","🕉️","🦸","🌱","🎪","🌙","☀️","⚡","🌊","💜","🔱","🔥","💎","🦋","🌸","🍀","🌈","⭐","🎯","🏆","🎗️","🌀","🔮","💫","🧘","🦅","🐉","🌺","🎵","💡","🌿","🦁","🐬","🌍","🎭","🛡️","⚔️","🗝️","🧬","🌠","🎋"],De={state:{isOpen:!1,currentUserId:null,isAppreciated:!1,appreciationCount:0},_LEVEL_TITLES:{1:"Seeker",2:"Practitioner",3:"Adept",4:"Healer",5:"Master",6:"Sage",7:"Enlightened",8:"Buddha",9:"Light",10:"Emptiness"},_STATUS_RINGS:{online:{c:"var(--ring-available,#6b9b37)",s:"rgba(107,155,55,0.2)"},available:{c:"var(--ring-available,#6b9b37)",s:"rgba(107,155,55,0.2)"},away:{c:"var(--ring-guiding,#e53e3e)",s:"rgba(229,62,62,0.2)"},silent:{c:"var(--ring-silent,#7c3aed)",s:"rgba(124,58,237,0.2)"},deep:{c:"var(--ring-deep,#1e40af)",s:"rgba(30,64,175,0.2)"},offline:{c:"var(--ring-offline,#9ca3af)",s:"rgba(156,163,175,0.2)"}},_RARITY_COLORS:{common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"},_RARITY_LABELS:{common:"Common",uncommon:"Uncommon",rare:"Rare",epic:"Epic",legendary:"Legendary"},_COUNTRY_CODES:{israel:"IL","united states":"US",usa:"US",us:"US","united kingdom":"GB",uk:"GB",canada:"CA",australia:"AU",germany:"DE",france:"FR",spain:"ES",italy:"IT",netherlands:"NL",belgium:"BE",switzerland:"CH",sweden:"SE",norway:"NO",denmark:"DK",finland:"FI",poland:"PL",portugal:"PT",austria:"AT",india:"IN",china:"CN",japan:"JP","south korea":"KR",brazil:"BR",mexico:"MX",argentina:"AR","south africa":"ZA",russia:"RU",ukraine:"UA",greece:"GR",turkey:"TR",egypt:"EG","new zealand":"NZ",ireland:"IE",singapore:"SG",thailand:"TH",indonesia:"ID",malaysia:"MY",philippines:"PH"},_ADMIN_SUB_IDS:["adminSubRole","adminSubXp","adminSubKarma","adminSubBadge","adminSubPremium","adminSubMessage","adminSubCustomBadge"],_buildEmojiPicker(e,t){return`
            <div id="${t}" style="display:none;margin-top:6px;padding:8px;border-radius:10px;
                        border:1px solid rgba(0,0,0,0.12);background:var(--neuro-bg);
                        display:none;flex-wrap:wrap;gap:4px;max-height:130px;overflow-y:auto;">
                ${ze.map(i=>`<button type="button" onclick="MemberProfileModal._pickEmoji('${e}','${t}','${i}')"
                             style="font-size:1.3rem;background:none;border:none;cursor:pointer;
                                    padding:3px 5px;border-radius:6px;line-height:1;transition:background 0.1s;"
                             onmouseover="this.style.background='rgba(0,0,0,0.07)'"
                             onmouseout="this.style.background='none'">${i}</button>`).join("")}
            </div>`},_pickEmoji(e,t,i){const o=document.getElementById(e);o&&(o.value=i);const n=document.getElementById(t);n&&(n.style.display="none")},_toggleEmojiPicker(e){const t=document.getElementById(e);t&&(t.style.display=t.style.display==="none"?"flex":"none")},init(){if(document.getElementById("memberProfileModal"))return;window.addEventListener("statusChanged",o=>{var s;const{status:n}=o.detail||{};if(!n||!this.state.isOpen||!(this.state.currentUserId===((s=window.Core.state.currentUser)==null?void 0:s.id)))return;const l=document.getElementById("memberModalStatusRing");if(!l)return;const a=this._STATUS_RINGS[n]||this._STATUS_RINGS.offline;l.style.borderColor=a.c,l.style.boxShadow=`0 0 0 3px ${a.s}`}),window.addEventListener("avatarChanged",o=>{const{userId:n,emoji:r,avatarUrl:l}=o.detail||{};if(!n||!this.state.isOpen||this.state.currentUserId!==n)return;const a=document.getElementById("memberModalAvatar");a&&(l?(a.style.background="transparent",a.innerHTML=`<img src="${l}" loading="lazy" decoding="async" width="80" height="80"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="avatar">`):r&&(a.style.background="",a.innerHTML=`<span>${xe(r)}</span>`))});const t=(window.BADGE_REGISTRY||[]).map(o=>`<option value="${o.id}" data-icon="${o.icon}" data-rarity="${o.rarity}" data-xp="${o.xp}" data-desc="${o.desc}">${o.icon} ${o.name}</option>`).join(""),i=document.createElement("div");i.innerHTML=`
            <div id="memberProfileModal"
                 class="modal-overlay"
                 role="dialog" aria-modal="true" aria-labelledby="memberModalName"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                        display:flex;align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">
                <div id="memberProfileModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:2rem;
                            max-width:380px;width:90%;position:relative;
                            max-height:90vh;overflow-y:auto;
                            box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                            transform:translateY(16px);transition:transform 0.25s ease;">

                    <button onclick="MemberProfileModal.close()" aria-label="Close"
                            style="position:absolute;top:14px;right:16px;background:none;border:none;
                                   cursor:pointer;font-size:18px;opacity:0.5;line-height:1;">✕</button>

                    <div id="memberModalLoading" style="text-align:center;padding:2rem;color:var(--text-muted);">
                        Loading...
                    </div>

                    <div id="memberModalContent" style="display:none;">

                        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:1rem;">
                            <div style="position:relative;width:90px;height:90px;flex-shrink:0;">
                                <div id="memberModalAvatar"
                                     style="width:90px;height:90px;min-width:90px;min-height:90px;
                                            border-radius:50%;
                                            display:flex;align-items:center;justify-content:center;
                                            font-size:2.2rem;overflow:hidden;flex-shrink:0;"></div>
                                <div id="memberModalStatusRing"
                                     style="position:absolute;top:-7px;left:-7px;
                                            width:calc(100% + 14px);height:calc(100% + 14px);
                                            border-radius:50%;border:4px solid var(--ring-available,#6b9b37);
                                            box-shadow:0 0 0 3px rgba(107,155,55,0.2);
                                            pointer-events:none;"></div>
                            </div>

                            <div id="memberModalName"
                                 style="font-size:1.25rem;font-weight:800;color:var(--neuro-text);text-align:center;"></div>

                            <div id="memberModalMetaRow"
                                 style="display:inline-flex;align-items:center;gap:0;
                                        background:var(--neuro-bg,#f0f0f3);border-radius:99px;
                                        box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                        overflow:hidden;max-width:100%;">
                                <div id="memberModalRole"
                                     style="display:flex;align-items:center;gap:5px;
                                            font-size:0.76rem;font-weight:700;
                                            color:var(--primary,#667eea);
                                            padding:5px 12px;white-space:nowrap;"></div>
                                <span id="memberModalMetaSep"
                                      style="width:1px;height:16px;background:rgba(0,0,0,0.1);flex-shrink:0;display:none;"></span>
                                <div id="memberModalLocation"
                                     style="display:flex;align-items:center;gap:0;"></div>
                            </div>
                        </div>

                        <div id="memberModalInspiration"
                             style="font-size:0.85rem;font-style:italic;color:var(--neuro-text-light,#555);
                                    text-align:center;margin-bottom:1rem;padding:0 0.5rem;line-height:1.5;"></div>

                        <div style="background:var(--neuro-bg,#f0f0f3);border-radius:16px;padding:1rem 1rem 0.75rem;
                                    box-shadow:3px 3px 8px rgba(0,0,0,0.08),-2px -2px 6px rgba(255,255,255,0.7);
                                    margin-bottom:0.9rem;">
                            <div style="text-align:center;margin-bottom:0.5rem;">
                                <span id="memberModalLevel"
                                      style="font-size:1.1rem;font-weight:700;color:var(--neuro-text);"></span>
                            </div>
                            <div style="height:8px;border-radius:99px;background:rgba(0,0,0,0.07);
                                        box-shadow:inset 1px 1px 3px rgba(0,0,0,0.1);overflow:hidden;margin-bottom:0.35rem;">
                                <div id="memberModalXpBar"
                                     style="height:100%;border-radius:99px;width:0%;
                                            background:linear-gradient(90deg,var(--primary,#667eea),var(--neuro-accent,#a855f7));
                                            transition:width 0.9s cubic-bezier(0.4,0,0.2,1);"></div>
                            </div>
                            <div style="font-size:0.78rem;color:var(--text-muted);text-align:center;">
                                <span id="memberModalXP"
                                      style="font-weight:800;font-size:0.95rem;color:var(--primary,#667eea);">-</span> XP
                            </div>
                        </div>

                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:1rem;">
                            ${[["memberModalKarma",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>',"Karma"],["memberModalBlessings",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',"Blessings"],["memberModalFavRoom",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',"Fav Room"],["memberModalBadgeCount",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',"Badges"]].map(([o,n,r])=>`
                                <div style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;
                                            padding:10px 6px;text-align:center;
                                            box-shadow:3px 3px 8px rgba(0,0,0,0.09),-2px -2px 6px rgba(255,255,255,0.7);
                                            transition:transform 0.15s;"
                                     onmouseover="this.style.transform='translateY(-2px)'"
                                     onmouseout="this.style.transform=''">
                                    <div style="font-size:1.2rem;line-height:1;margin-bottom:3px;">${n}</div>
                                    <div id="${o}" style="font-size:1rem;font-weight:800;
                                                           color:var(--primary,#667eea);line-height:1;">-</div>
                                    <div style="font-size:0.62rem;color:var(--text-muted);font-weight:600;
                                                text-transform:uppercase;letter-spacing:0.03em;margin-top:3px;">${r}</div>
                                </div>`).join("")}
                        </div>

                        <button id="memberModalAppreciateBtn"
                                onclick="MemberProfileModal.toggleAppreciate()"
                                style="width:100%;padding:10px;border-radius:12px;border:none;cursor:pointer;
                                       font-size:0.9rem;font-weight:600;margin-bottom:10px;
                                       background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                                       box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                       transition:all 0.2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciate
                        </button>

                        <div id="memberModalActions" style="display:flex;gap:10px;margin-bottom:1rem;">
                            <button id="memberModalWhisperBtn" onclick="MemberProfileModal.startWhisper()"
                                    style="flex:1;padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--primary,#667eea);
                                           box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                           transition:all 0.15s;"
                                    onmouseover="this.style.boxShadow='2px 2px 6px rgba(0,0,0,0.12),-1px -1px 4px rgba(255,255,255,0.8)';this.style.transform='translateY(1px)'"
                                    onmouseout="this.style.boxShadow='4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75)';this.style.transform=''">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whisper
                            </button>
                            <button onclick="MemberProfileModal.startReport()"
                                    style="padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--text-muted,#718096);
                                           box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                           transition:all 0.15s;"
                                    onmouseover="this.style.boxShadow='2px 2px 6px rgba(0,0,0,0.12),-1px -1px 4px rgba(255,255,255,0.8)';this.style.transform='translateY(1px)'"
                                    onmouseout="this.style.boxShadow='4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75)';this.style.transform=''">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> Report
                            </button>
                            <button onclick="MemberProfileModal.startBlock()"
                                    style="padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--text-muted,#718096);
                                           box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                           transition:all 0.15s;"
                                    onmouseover="this.style.boxShadow='2px 2px 6px rgba(0,0,0,0.12),-1px -1px 4px rgba(255,255,255,0.8)';this.style.transform='translateY(1px)'"
                                    onmouseout="this.style.boxShadow='4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75)';this.style.transform=''">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Block
                            </button>
                        </div>

                        <div id="memberModalWhisperPanel" style="display:none;margin-top:0.5rem;">
                            <textarea id="memberModalWhisperText" placeholder="Write a private message..."
                                      maxlength="500" rows="3"
                                      style="width:100%;padding:10px;border-radius:10px;
                                             border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                             background:var(--neuro-bg);color:var(--neuro-text);box-sizing:border-box;"></textarea>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button onclick="MemberProfileModal.sendWhisper()"
                                        style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;font-weight:600;
                                               background:var(--primary,#667eea);color:#fff;">Send</button>
                                <button onclick="MemberProfileModal.cancelWhisper()"
                                        style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                               color:var(--neuro-text);">Cancel</button>
                            </div>
                        </div>

                        <div id="memberModalReportPanel" style="display:none;margin-top:0.5rem;">
                            <select id="memberModalReportReason"
                                    style="width:100%;padding:10px;border-radius:10px;
                                           border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                           margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                <option value="">Select a reason...</option>
                                <option value="harassment">Harassment</option>
                                <option value="spam">Spam</option>
                                <option value="inappropriate">Inappropriate content</option>
                                <option value="hate">Hate speech</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea id="memberModalReportDetails" placeholder="Additional details (optional)"
                                      maxlength="300" rows="2"
                                      style="width:100%;padding:10px;border-radius:10px;
                                             border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                             background:var(--neuro-bg);color:var(--neuro-text);box-sizing:border-box;"></textarea>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button onclick="MemberProfileModal.submitReport()"
                                        style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;font-weight:600;background:#ef4444;color:#fff;">
                                    Submit Report
                                </button>
                                <button onclick="MemberProfileModal.cancelReport()"
                                        style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                               color:var(--neuro-text);">Cancel</button>
                            </div>
                        </div>

                        <div id="memberModalAdminSection" style="display:none;margin-top:1rem;">
                            <div onclick="MemberProfileModal._toggleAdminPanel()"
                                 style="display:flex;align-items:center;justify-content:space-between;
                                        padding:10px 14px;border-radius:12px;cursor:pointer;
                                        background:rgba(var(--neuro-accent-rgb, 168,85,247),0.08);border:2px dashed rgba(var(--neuro-accent-rgb, 168,85,247),0.4);
                                        user-select:none;">
                                <span style="font-size:0.78rem;font-weight:700;text-transform:uppercase;
                                             letter-spacing:1px;color:var(--neuro-accent);display:inline-flex;align-items:center;gap:0.4rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin Controls
                                </span>
                                <span id="memberModalAdminToggle" style="font-size:0.75rem;color:var(--neuro-accent);">▶</span>
                            </div>

                            <div id="memberModalAdminBody" style="display:none;margin-top:10px;">
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                                    ${[["role","👤 Change Role"],["xp","⭐ Send XP"],["karma","🌀 Send Karma"],["badge","🎖️ Send Badge"],["customBadge","✨ Custom Badge"],["premium","🔓 Unlock Premium"],["message","📩 Send Message"]].map(([o,n])=>`<button onclick="MemberProfileModal._openAdminSub('${o}')"
                                                style="padding:9px 6px;border-radius:10px;border:none;cursor:pointer;
                                                       font-size:0.82rem;font-weight:600;
                                                       background:rgba(var(--neuro-accent-rgb, 168,85,247),0.1);color:var(--neuro-accent);">
                                            ${n}
                                        </button>`).join("")}
                                </div>

                                <div id="adminSubRole" style="display:none;" class="admin-sub-panel">
                                    <select id="adminRoleSelect"
                                            style="width:100%;padding:9px;border-radius:10px;margin-bottom:8px;
                                                   border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                   background:var(--neuro-bg);color:var(--neuro-text);">
                                        <option>Member</option><option>Moderator</option>
                                        <option>Guide</option><option>Elder</option><option>VIP</option><option>Admin</option>
                                    </select>
                                    ${this._adminSubFooter("_adminChangeRole","Save Role")}
                                </div>

                                <div id="adminSubXp" style="display:none;" class="admin-sub-panel">
                                    <input type="number" id="adminXpAmount" min="1" value="100" placeholder="XP amount"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    ${this._adminSubFooter("_adminSendXP","Send XP")}
                                </div>

                                <div id="adminSubKarma" style="display:none;" class="admin-sub-panel">
                                    <input type="number" id="adminKarmaAmount" min="1" value="50" placeholder="Karma amount"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    ${this._adminSubFooter("_adminSendKarma","Send Karma")}
                                </div>

                                <div id="adminSubBadge" style="display:none;" class="admin-sub-panel">
                                    <select id="adminBadgeSelect"
                                            style="width:100%;padding:9px;border-radius:10px;margin-bottom:8px;
                                                   border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                   background:var(--neuro-bg);color:var(--neuro-text);">
                                        ${t}
                                    </select>
                                    ${this._adminSubFooter("_adminSendBadge","Award Badge")}
                                </div>

                                <div id="adminSubCustomBadge" style="display:none;" class="admin-sub-panel">
                                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                                        <input type="text" id="adminCustomBadgeIcon" maxlength="4" value="🏅" readonly
                                               style="width:52px;padding:9px;border-radius:10px;box-sizing:border-box;
                                                      border:1px solid rgba(0,0,0,0.12);font-size:1.5rem;text-align:center;
                                                      background:var(--neuro-bg);color:var(--neuro-text);cursor:default;">
                                        <button type="button"
                                                onclick="MemberProfileModal._toggleEmojiPicker('adminCustomBadgeEmojiPicker')"
                                                style="flex:1;padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                                                       font-size:0.82rem;font-weight:600;cursor:pointer;
                                                       background:var(--neuro-bg);color:var(--neuro-accent);">
                                            Choose Emoji ▾
                                        </button>
                                    </div>
                                    ${this._buildEmojiPicker("adminCustomBadgeIcon","adminCustomBadgeEmojiPicker")}

                                    <input type="text" id="adminCustomBadgeName" maxlength="40" placeholder="Badge name"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">

                                    <textarea id="adminCustomBadgeDesc" placeholder="Description (optional)" maxlength="120" rows="2"
                                              style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                     border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                                     margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);"></textarea>

                                    <select id="adminCustomBadgeRarity"
                                            style="width:100%;padding:9px;border-radius:10px;margin-bottom:8px;
                                                   border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                   background:var(--neuro-bg);color:var(--neuro-text);">
                                        <option value="common">Common</option>
                                        <option value="uncommon">Uncommon</option>
                                        <option value="rare">Rare</option>
                                        <option value="epic" selected>Epic</option>
                                        <option value="legendary">Legendary</option>
                                    </select>

                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                                        <input type="number" id="adminCustomBadgeXp" min="0" value="100" placeholder="XP reward"
                                               style="padding:9px;border-radius:10px;box-sizing:border-box;
                                                      border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                      background:var(--neuro-bg);color:var(--neuro-text);">
                                        <input type="number" id="adminCustomBadgeKarma" min="0" value="15" placeholder="Karma reward"
                                               style="padding:9px;border-radius:10px;box-sizing:border-box;
                                                      border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                      background:var(--neuro-bg);color:var(--neuro-text);">
                                    </div>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;font-size:0.72rem;
                                                color:var(--text-muted);text-align:center;margin-bottom:8px;">
                                        <span>XP reward</span><span>Karma reward</span>
                                    </div>
                                    ${this._adminSubFooter("_adminSendCustomBadge","Award Custom Badge")}
                                </div>

                                <div id="adminSubPremium" style="display:none;" class="admin-sub-panel">
                                    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;
                                                max-height:160px;overflow-y:auto;padding:4px 0;">
                                        ${[["advance_tarot_spreads","Advanced Tarot Spreads"],["tarot_vision_ai","Tarot Vision AI"],["shadow_alchemy_lab","Shadow Alchemy Lab"],["advanced_meditations","Advanced Meditations"],["self_analysis_pro","Self-Analysis Pro"],["luxury_blush_champagne_skin","Blush Champagne Skin"],["luxury_champagne_gold_skin","Champagne Gold Skin"],["luxury_marble_bronze_skin","Marble Bronze Skin"],["royal_indigo_skin","Royal Indigo Skin"],["earth_luxury_skin","Earth Luxury Skin"]].map(([o,n])=>`<label style="display:flex;align-items:center;gap:8px;font-size:0.83rem;cursor:pointer;">
                                                <input type="checkbox" value="${o}"> ${n}
                                            </label>`).join("")}
                                    </div>
                                    ${this._adminSubFooter("_adminUnlockPremium","Unlock Selected")}
                                </div>

                                <div id="adminSubMessage" style="display:none;" class="admin-sub-panel">
                                    <input type="text" id="adminMessageTitle" placeholder="Message title" maxlength="100"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    <textarea id="adminMessageContent" placeholder="Write your message..." rows="3" maxlength="1000"
                                              style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                     border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                                     margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);"></textarea>
                                    ${this._adminSubFooter("_adminSendMessage","Send Message")}
                                </div>
                            </div>
                        </div>

                    </div><!-- /content -->
                </div><!-- /inner -->
            </div><!-- /modal -->`,document.body.appendChild(i.firstElementChild),document.getElementById("memberProfileModal").addEventListener("click",o=>{o.target.id==="memberProfileModal"&&this.close()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&this.state.isOpen&&this.close()})},_adminSubFooter(e,t){return`<div style="display:flex;gap:8px;">
            <button onclick="MemberProfileModal.${e}()"
                    style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                           font-size:0.88rem;font-weight:600;background:var(--neuro-accent);color:#fff;">
                ${t}
            </button>
            <button onclick="MemberProfileModal._closeAdminSubs()"
                    style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                           font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                           color:var(--neuro-text);">Cancel</button>
        </div>`},async open(e){var l,a;if(this.init(),!e)return;const t=e===((l=window.Core.state.currentUser)==null?void 0:l.id);this.state.currentUserId=e,this.state.isOpen=!0;const i=document.getElementById("memberProfileModal"),o=document.getElementById("memberProfileModalInner"),n=document.getElementById("memberModalLoading"),r=document.getElementById("memberModalContent");this._hideActionPanels(),n.style.display="block",r.style.display="none",i.style.display="flex",requestAnimationFrame(()=>{i.style.opacity="1",o.style.transform="translateY(0)"}),document.body.style.overflow="hidden";try{const s=await c.getProfile(e);if(!s){window.Core.showToast("Could not load member profile"),this.close();return}if(this._populate(s),!t){const h=c.subscribeToPresence(v=>{const b=v.find(P=>P.user_id===e);if(!b||!this.state.isOpen)return;const x=document.getElementById("memberModalStatusRing");if(!x)return;const I=this._STATUS_RINGS[b.status]||this._STATUS_RINGS.offline;x.style.borderColor=I.c,x.style.boxShadow=`0 0 0 3px ${I.s}`});this._presenceUnsub=()=>{try{h==null||h.unsubscribe()}catch{}}}const d=document.getElementById("memberModalActions"),u=document.getElementById("memberModalAppreciateBtn");d&&(d.style.display=t?"none":"flex"),u&&(u.style.display=t?"none":"block");const m=document.getElementById("memberModalAdminSection"),g=(a=window.Core.state.currentUser)==null?void 0:a.is_admin;if(m){if(m.style.display=g?"block":"none",g&&s.community_role){const x=document.getElementById("adminRoleSelect");x&&(x.value=s.community_role)}const h=document.getElementById("memberModalAdminBody"),v=document.getElementById("memberModalAdminToggle");h&&(h.style.display="none"),v&&(v.textContent="▶"),this._closeAdminSubs();const b=document.querySelector(`button[onclick*="_openAdminSub('role')"]`);b&&(b.style.display=t?"none":"inline-block")}t||(this.state.isAppreciated=!1,this.state.appreciationCount=0,this._updateAppreciateBtn(),Promise.all([c.getMyUserAppreciations(),c.getUserAppreciationCount(e)]).then(([h,v])=>{this.state.isAppreciated=h.has(e),this.state.appreciationCount=v,this._updateAppreciateBtn()}).catch(()=>{})),c.getUserProgress(e).then(h=>{h&&this._populateGamification(h)}).catch(()=>{}),this._loadMemberCommunityStats(e).catch(()=>{}),n.style.display="none",r.style.display="block"}catch(s){console.error("[MemberProfileModal] open error:",s),window.Core.showToast("Could not load member profile"),this.close()}},close(){const e=document.getElementById("memberProfileModal"),t=document.getElementById("memberProfileModalInner");e&&(e.style.opacity="0",t.style.transform="translateY(16px)",setTimeout(()=>{e.style.display="none",this.state.isOpen=!1,this.state.currentUserId=null,document.body.style.overflow="",this._hideActionPanels(),this._presenceUnsub&&(this._presenceUnsub(),this._presenceUnsub=null)},250))},_populate(e){const t=document.getElementById("memberModalAvatar");t&&(e.avatar_url?(t.style.background="transparent",t.innerHTML=`<img src="${e.avatar_url}" loading="lazy" decoding="async" width="80" height="80"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
                    alt="${this._esc(e.name)}">`):(t.style.background=window.Core.getAvatarGradient(e.id),t.innerHTML=`<span>${this._esc(e.emoji||(e.name||"?").charAt(0).toUpperCase())}</span>`));const i=document.getElementById("memberModalStatusRing");if(i){const r=this._STATUS_RINGS[e.community_status]||this._STATUS_RINGS.offline;i.style.borderColor=r.c,i.style.boxShadow=`0 0 0 3px ${r.s}`}this._setText("memberModalName",e.name||"Member"),this._setHTML("memberModalRole",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${e.community_role||"Member"}`),this._setText("memberModalInspiration",e.inspiration?`"${e.inspiration}"`:"");const o=document.getElementById("memberModalLocation"),n=document.getElementById("memberModalMetaSep");if(o){const r=[];if(e.birthday)try{const l=new Date(e.birthday+"T00:00:00");r.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${l.toLocaleDateString(void 0,{month:"long",day:"numeric"})}`)}catch{r.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${e.birthday}`)}e.country&&r.push(`${this._countryFlag(e.country)} ${e.country}`),r.length?(o.innerHTML=r.map((l,a)=>`${a>0?'<span style="width:1px;height:16px;background:rgba(0,0,0,0.1);flex-shrink:0;display:inline-block;"></span>':""}
                     <span style="font-size:0.76rem;font-weight:600;color:var(--text-muted);padding:5px 12px;white-space:nowrap;">${l}</span>`).join(""),n&&(n.style.display="")):(o.innerHTML="",n&&(n.style.display="none"))}},_populateGamification(e){const t=this._LEVEL_TITLES[e.level]||"Seeker",i=t.match(/^[aeiou]/i)?"An":"A",o=document.getElementById("memberModalLevel");o&&(o.textContent=`${i} ${t} - Level ${e.level}`);const n=document.getElementById("memberModalXpBar");if(n){const r=[0,800,2e3,4200,7e3,12e3,3e4,6e4,18e4,45e4],l=r[e.level-1]||0,a=r[e.level]||r[r.length-1],s=a>l?Math.min(100,Math.round((e.xp-l)/(a-l)*100)):100;requestAnimationFrame(()=>{n.style.width=s+"%"})}this._setText("memberModalXP",(e.xp??0).toLocaleString()),this._setText("memberModalKarma",(e.karma??0).toLocaleString()),this._setText("memberModalBadgeCount",(e.badges||[]).length)},async _loadMemberCommunityStats(e){if(!c.ready)return;const t=c._sb;try{const[i,o]=await Promise.all([t.from("room_blessings").select("*",{count:"exact",head:!0}).eq("user_id",e),t.from("room_entries").select("room_id").eq("user_id",e)]);this._setText("memberModalBlessings",!i.error&&i.count!=null?i.count.toLocaleString():"0");const n=o.data;if(!o.error&&(n!=null&&n.length)){const r={};for(const a of n)r[a.room_id]=(r[a.room_id]||0)+1;const l=Object.entries(r).sort((a,s)=>s[1]-a[1])[0][0];this._setText("memberModalFavRoom",l.replace(/-/g," ").replace(/\b\w/g,a=>a.toUpperCase()))}else this._setText("memberModalFavRoom","-")}catch(i){console.warn("[MemberProfileModal] _loadMemberCommunityStats:",i)}},async toggleAppreciate(){const e=document.getElementById("memberModalAppreciateBtn");if(!(!e||!this.state.currentUserId)){e.disabled=!0;try{const t=await c.toggleUserAppreciation(this.state.currentUserId,this.state.isAppreciated);if(!t){window.Core.showToast("Could not update - please try again");return}this.state.isAppreciated=t.appreciated,this.state.appreciationCount=await c.getUserAppreciationCount(this.state.currentUserId),this._updateAppreciateBtn(),window.Core.showToast(t.appreciated?"Appreciation sent":"Appreciation removed")}catch(t){console.error("[MemberProfileModal] toggleAppreciate error:",t),window.Core.showToast("Could not update - please try again")}finally{e.disabled=!1}}},_updateAppreciateBtn(){const e=document.getElementById("memberModalAppreciateBtn");if(!e)return;const t=this.state.appreciationCount??"",i=t!==""?` (${t})`:"";this.state.isAppreciated?(e.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciated${i}`,e.style.background="var(--primary,#667eea)",e.style.color="#fff",e.style.boxShadow="inset 2px 2px 5px rgba(0,0,0,0.15)"):(e.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciate${i}`,e.style.background="var(--neuro-bg,#f0f0f3)",e.style.color="var(--neuro-text)",e.style.boxShadow="3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7)")},startWhisper(){var t;this._hideActionPanels();const e=document.getElementById("memberModalWhisperPanel");e&&(e.style.display="block",(t=document.getElementById("memberModalWhisperText"))==null||t.focus())},cancelWhisper(){const e=document.getElementById("memberModalWhisperPanel");if(!e)return;e.style.display="none";const t=document.getElementById("memberModalWhisperText");t&&(t.value="")},async sendWhisper(){const e=document.getElementById("memberModalWhisperText"),t=e==null?void 0:e.value.trim();if(!t){window.Core.showToast("Please write a message first");return}await this._withBtnState("#memberModalWhisperPanel button","Sending...","Send",async()=>{await c.sendWhisper(this.state.currentUserId,t)?(window.Core.showToast("Whisper sent"),this.cancelWhisper()):window.Core.showToast("Could not send - please try again")})},startReport(){this._hideActionPanels();const e=document.getElementById("memberModalReportPanel");e&&(e.style.display="block")},cancelReport(){const e=document.getElementById("memberModalReportPanel");if(!e)return;e.style.display="none";const t=document.getElementById("memberModalReportReason"),i=document.getElementById("memberModalReportDetails");t&&(t.value=""),i&&(i.value="")},async submitReport(){var i,o;const e=(i=document.getElementById("memberModalReportReason"))==null?void 0:i.value,t=((o=document.getElementById("memberModalReportDetails"))==null?void 0:o.value.trim())||"";if(!e){window.Core.showToast("Please select a reason");return}await this._withBtnState("#memberModalReportPanel button","Submitting...","Submit Report",async()=>{await c.submitReport(this.state.currentUserId,e,t)?(window.Core.showToast("Report submitted - thank you"),this.cancelReport()):window.Core.showToast("Could not submit - please try again")})},async startBlock(){var t,i;const e=((t=document.getElementById("memberModalName"))==null?void 0:t.textContent)||"this member";if(confirm(`Block ${e}? Their content will be hidden from you.`))try{await c.blockUser(this.state.currentUserId)?(window.Core.showToast(`${e} blocked`),this.close(),(i=window.ActiveMembers)==null||i.refresh()):window.Core.showToast("Could not block - please try again")}catch(o){console.error("[MemberProfileModal] blockUser error:",o),window.Core.showToast("Could not block - please try again")}},_toggleAdminPanel(){const e=document.getElementById("memberModalAdminBody"),t=document.getElementById("memberModalAdminToggle");if(!e)return;const i=e.style.display!=="none";e.style.display=i?"none":"block",t.textContent=i?"▶":"▼",i&&this._closeAdminSubs()},_openAdminSub(e){this._closeAdminSubs();const t=e.charAt(0).toUpperCase()+e.slice(1),i=document.getElementById(`adminSub${t}`);i&&(i.style.display="block")},_closeAdminSubs(){for(const e of this._ADMIN_SUB_IDS){const t=document.getElementById(e);t&&(t.style.display="none")}},async _adminChangeRole(){var t;const e=(t=document.getElementById("adminRoleSelect"))==null?void 0:t.value;!e||!this.state.currentUserId||await this._withBtnState("#adminSubRole button","Saving...","Save Role",async()=>{const i={community_role:e};i.is_vip=e==="VIP",i.is_admin=e==="Admin";const{error:o}=await c._sb.rpc("admin_update_profile",{target_user_id:this.state.currentUserId,new_role:i.community_role,new_is_vip:i.is_vip,new_is_admin:i.is_admin});if(o)throw o;this._setHTML("memberModalRole",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${e}`),await this._adminPushNotify(this.state.currentUserId,"👤 Role Updated",`Your community role has been changed to ${e}.`),window.Core.showToast(`Role changed to ${e}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendXP(){var t;const e=parseInt((t=document.getElementById("adminXpAmount"))==null?void 0:t.value,10);if(!e||e<1){window.Core.showToast("Enter a valid XP amount");return}await this._withBtnState("#adminSubXp button","Sending...","Send XP",async()=>{if(!await c.adminUpdateGamification(this.state.currentUserId,{xpDelta:e}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎁 Gift from Aanandoham!",`You received +${e} XP!`),window.Core.showToast(`Sent ${e} XP`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendKarma(){var t;const e=parseInt((t=document.getElementById("adminKarmaAmount"))==null?void 0:t.value,10);if(!e||e<1){window.Core.showToast("Enter a valid Karma amount");return}await this._withBtnState("#adminSubKarma button","Sending...","Send Karma",async()=>{if(!await c.adminUpdateGamification(this.state.currentUserId,{karmaDelta:e}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎁 Gift from Aanandoham!",`You received +${e} Karma!`),window.Core.showToast(`Sent ${e} Karma`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendBadge(){const e=document.getElementById("adminBadgeSelect"),t=e==null?void 0:e.selectedOptions[0];if(!t)return;const o=(window.BADGE_REGISTRY||[]).find(r=>r.id===t.value)||{},n={id:t.value,name:o.name||t.textContent.replace(/^.+? /,"").trim(),icon:o.icon||t.dataset.icon||"🏅",rarity:o.rarity||t.dataset.rarity||"common",xp:o.xp??parseInt(t.dataset.xp,10)??0,description:o.desc||t.dataset.desc||""};await this._withBtnState("#adminSubBadge button","Awarding...","Award Badge",async()=>{if(!await c.adminUpdateGamification(this.state.currentUserId,{badgeId:n.id,badgeName:n.name,badgeIcon:n.icon,badgeRarity:n.rarity,badgeXp:n.xp,badgeDesc:n.description}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎖️ New Badge Earned!",`You received the ${n.name} badge!`),window.Core.showToast(`Awarded ${n.icon} ${n.name}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendCustomBadge(){var a,s,d,u,m,g;const e=((a=document.getElementById("adminCustomBadgeIcon"))==null?void 0:a.value.trim())||"🏅",t=(s=document.getElementById("adminCustomBadgeName"))==null?void 0:s.value.trim(),i=((d=document.getElementById("adminCustomBadgeDesc"))==null?void 0:d.value.trim())||"",o=((u=document.getElementById("adminCustomBadgeRarity"))==null?void 0:u.value)||"epic",n=parseInt((m=document.getElementById("adminCustomBadgeXp"))==null?void 0:m.value,10)||0,r=parseInt((g=document.getElementById("adminCustomBadgeKarma"))==null?void 0:g.value,10)||0;if(!t){window.Core.showToast("Please enter a badge name");return}const l="custom_"+t.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")+"_"+Date.now();await this._withBtnState("#adminSubCustomBadge button","Awarding...","Award Custom Badge",async()=>{if(!await c.adminUpdateGamification(this.state.currentUserId,{badgeId:l,badgeName:t,badgeIcon:e,badgeRarity:o,badgeXp:n,badgeDesc:i}))throw new Error("Save failed");r>0&&await c.adminUpdateGamification(this.state.currentUserId,{karmaDelta:r}),await this._adminPushNotify(this.state.currentUserId,"🎖️ Special Badge Earned!",`You received the ${t} badge!`),window.Core.showToast(`Awarded custom badge: ${e} ${t}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminUnlockPremium(){const e=[...document.querySelectorAll("#adminSubPremium input[type=checkbox]:checked")].map(t=>t.value);if(!e.length){window.Core.showToast("Select at least one feature");return}await this._withBtnState("#adminSubPremium button","Unlocking...","Unlock Selected",async()=>{let t=0;const i=[];for(const n of e)await c.adminUpdateGamification(this.state.currentUserId,{unlockFeature:n})?t++:i.push(n);if(i.length&&console.warn("[AdminPanel] Failed to unlock:",i),!t)throw new Error("All unlocks failed");const o=e.map(n=>n.replace(/_/g," ").replace(/\b\w/g,r=>r.toUpperCase())).join(", ");await this._adminPushNotify(this.state.currentUserId,"🔓 New Features Unlocked!",`Admin unlocked: ${o}`),window.Core.showToast(`Unlocked ${t}/${e.length} feature(s)${i.length?` (${i.length} failed)`:""}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendMessage(){var i,o;const e=(i=document.getElementById("adminMessageTitle"))==null?void 0:i.value.trim(),t=(o=document.getElementById("adminMessageContent"))==null?void 0:o.value.trim();if(!e){window.Core.showToast("Please enter a message title");return}if(!t){window.Core.showToast("Please enter a message");return}await this._withBtnState("#adminSubMessage button","Sending...","Send Message",async()=>{const{data:n}=await c._sb.from("user_progress").select("payload").eq("user_id",this.state.currentUserId).single(),r=(n==null?void 0:n.payload)||{},l=r.adminMessages||[];l.push({id:Date.now()+Math.random(),title:e,content:t,date:new Date().toISOString(),read:!1});const{error:a}=await c._sb.from("user_progress").update({payload:{...r,adminMessages:l},updated_at:new Date().toISOString()}).eq("user_id",this.state.currentUserId);if(a)throw a;const s=t.length>80?t.slice(0,80)+"...":t;await this._adminPushNotify(this.state.currentUserId,`💬 ${e}`,s),window.Core.showToast("Message sent"),this._closeAdminSubs(),document.getElementById("adminMessageTitle").value="",document.getElementById("adminMessageContent").value=""})},async _safeRefresh(e){var o,n,r,l,a,s,d,u,m;const t=(o=window.Core.state.currentUser)==null?void 0:o.id;if(e===t){const g=(n=window.app)==null?void 0:n.gamification;g!=null&&g.saveTimeout&&(clearTimeout(g.saveTimeout),g.saveTimeout=null),(l=(r=window.DB)==null?void 0:r.clearCache)==null||l.call(r),(d=(s=(a=window.app)==null?void 0:a.state)==null?void 0:s.clearCache)==null||d.call(s);try{const h=await c.getUserProgress(e);h&&(g!=null&&g.state)&&(h.xp!==void 0&&(g.state.xp=h.xp),h.karma!==void 0&&(g.state.karma=h.karma),h.level!==void 0&&(g.state.level=h.level),Array.isArray(h.badges)&&(g.state.badges=h.badges),Array.isArray(h.unlockedFeatures)&&(g.state.unlockedFeatures=h.unlockedFeatures)),h&&((m=(u=window.app)==null?void 0:u.state)!=null&&m.data)&&(h.xp!==void 0&&(window.app.state.data.xp=h.xp),h.karma!==void 0&&(window.app.state.data.karma=h.karma),h.level!==void 0&&(window.app.state.data.level=h.level),Array.isArray(h.badges)&&(window.app.state.data.badges=h.badges),Array.isArray(h.unlockedFeatures)&&(window.app.state.data.unlockedFeatures=h.unlockedFeatures))}catch(h){console.warn("[_safeRefresh] pre-patch failed:",h)}}await this._refreshMainProfileStats(e)},async _refreshMainProfileStats(e){var t,i,o,n,r,l;try{const a=(t=window.Core.state.currentUser)==null?void 0:t.id;if(!a)return;const s=e||a,d=await c.getUserProgress(s);if(!d)return;if(s===a){d.xp!==void 0&&(window.Core.state.currentUser.xp=d.xp),d.karma!==void 0&&(window.Core.state.currentUser.karma=d.karma),d.level!==void 0&&(window.Core.state.currentUser.level=d.level),await((n=(o=(i=window.app)==null?void 0:i.gamification)==null?void 0:o.reloadFromDatabase)==null?void 0:n.call(o));const u=document.getElementById("profileGamificationXP");u&&d.xp!==void 0&&(u.textContent=d.xp.toLocaleString()),(l=(r=window.ProfileModule)==null?void 0:r.refreshGamification)==null||l.call(r)}this._populateGamification(d)}catch(a){console.warn("[AdminPanel] _refreshMainProfileStats:",a)}},async _adminPushNotify(e,t,i){try{const o=await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e,payload:{title:t,body:i,icon:"/icons/icon-192x192.png",data:{url:"/"}}})});o.ok||console.warn(`[MemberProfileModal] push notify non-200: ${o.status}`)}catch(o){console.warn("[MemberProfileModal] push notify unavailable:",o.message)}},_hideActionPanels(){["memberModalWhisperPanel","memberModalReportPanel"].forEach(o=>{const n=document.getElementById(o);n&&(n.style.display="none")});const e=document.getElementById("memberModalWhisperText");e&&(e.value="");const t=document.getElementById("memberModalReportReason"),i=document.getElementById("memberModalReportDetails");t&&(t.value=""),i&&(i.value=""),this._closeAdminSubs()},_setText(e,t){const i=document.getElementById(e);i&&(i.textContent=t)},_setHTML(e,t){const i=document.getElementById(e);i&&(i.innerHTML=t)},async _withBtnState(e,t,i,o){const n=document.querySelector(e);n&&(n.disabled=!0,n.textContent=t);try{await o()}catch(r){console.error(`[AdminPanel] ${i} error:`,r),window.Core.showToast(`Could not complete: ${i}`)}finally{n&&(n.disabled=!1,n.textContent=i)}},_countryFlag(e){const t=this._COUNTRY_CODES[e.toLowerCase().trim()];return t?[...t].map(i=>String.fromCodePoint(127462+i.charCodeAt(0)-65)).join(""):"🌍"},_esc(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}};window.MemberProfileModal=De;const F={_instances:new Set,_subscribed:!1,_retryTimer:null,_blockedCache:null,register(e){this._instances.add(e),this._subscribed||this._subscribe()},unregister(e){this._instances.delete(e),this._instances.size===0&&(this._unsubscribe(),this._blockedCache=null)},async getBlocked(){return this._blockedCache||(this._blockedCache=c.getBlockedUsers().catch(()=>new Set)),this._blockedCache},invalidateBlocked(){this._blockedCache=null},_subscribe(){if(!c.ready){this._retryTimer=setInterval(()=>{c.ready&&(clearInterval(this._retryTimer),this._retryTimer=null,this._doSubscribe())},300);return}this._doSubscribe()},_doSubscribe(){const e=c.subscribeToPresence(async t=>{const i=await this.getBlocked(),o=t.filter(n=>!i.has(n.user_id));this._instances.forEach(n=>n._onPresenceUpdate(o))});this._subscribed=!!e},_unsubscribe(){clearInterval(this._retryTimer),this._retryTimer=null,this._subscribed=!1}},He=new Set(["online","available","away","guiding","silent","deep","offline"]),Ee={online:"online",available:"online",away:"away",guiding:"away",silent:"silent",deep:"deep",offline:"offline"},Ue=1e4,je=150;class Oe{constructor(t){if(!(t instanceof HTMLElement))throw new TypeError("[ActiveMembersWidget] containerEl must be an HTMLElement");this.container=t,this.isRendered=!1,this._destroyed=!1}render(){this.container.innerHTML=this._buildShell("Loading..."),this._waitForDB().then(()=>Promise.all([c.getActiveMembers(),F.getBlocked()])).then(([t,i])=>{if(this._destroyed)return;const o=t.filter(n=>!i.has(n.user_id));this._paint(o),F.register(this),this.isRendered=!0}).catch(t=>{this._destroyed||(console.error("[ActiveMembersWidget] render error:",t),this.container.innerHTML=this._buildShell("Could not load members."))})}async refresh(){this.isRendered=!1,this.render()}updateMemberStatus(t,i){if(!He.has(i))return;const o=this.container.querySelector(`[data-member-id="${t}"]`),n=o==null?void 0:o.querySelector(".member-mini-status");n&&(["online","away","offline","silent","deep"].forEach(r=>n.classList.remove(r)),n.classList.add(Ee[i]||"offline"),n.setAttribute("aria-label",i),n.setAttribute("title",Te(i)))}updateMemberActivity(t,i){if(!i||typeof i!="string")return;const o=this.container.querySelector(`[data-member-id="${t}"] .member-mini-info`);o&&(o.textContent=i)}updateMemberAvatar(t,{emoji:i,avatarUrl:o}={}){const n=this.container.querySelector(`[data-member-id="${t}"]`),r=n==null?void 0:n.querySelector(".member-mini-avatar");r&&(o?(r.style.background="transparent",r.innerHTML=`<img src="${o}"
                style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                alt="" loading="lazy" decoding="async">`):i&&(r.style.background="",r.innerHTML=`<span class="member-avatar-icon">${xe(i)}</span>`))}destroy(){this._destroyed=!0,F.unregister(this),this.isRendered=!1}_waitForDB(){return c.ready?Promise.resolve():new Promise((t,i)=>{const o=Date.now(),n=setInterval(()=>{this._destroyed?(clearInterval(n),i(new Error("widget destroyed"))):c.ready?(clearInterval(n),t()):Date.now()-o>Ue&&(clearInterval(n),i(new Error("CommunityDB not ready after timeout")))},je)})}_onPresenceUpdate(t){this._paint(t)}_paint(t){const i=t.filter(r=>r.status==="online"||r.status==="available").length,o=this.container.querySelector(".active-members-online-count"),n=this.container.querySelector(".active-members-grid");o&&n?(o.textContent=`${i} online`,n.innerHTML=ke(t)):this.container.innerHTML=this._buildShell(`${i} online`,t)}_buildShell(t,i=null){const o=i===null?"":`
            <div class="active-members-grid">
                ${ke(i)}
            </div>
            <button type="button" onclick="window._openWhisperModal()"
                    style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:none;
                           cursor:pointer;font-size:0.88rem;font-weight:600;
                           background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                           box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           position:relative;transition:opacity 0.15s;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round" class="lucide-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Whispers
                <span id="whisperUnreadBadge"
                      style="display:none;background:var(--neuro-accent);color:#fff;
                             border-radius:99px;font-size:0.7rem;font-weight:700;
                             padding:2px 7px;min-width:18px;text-align:center;"></span>
            </button>`;return`
            <section class="section" aria-labelledby="activeMembersTitle-${this._uid}">
                <div class="section-header">
                    <div class="section-title" id="activeMembersTitle-${this._uid}">Active Members</div>
                    <div class="active-members-online-count"
                         style="font-size:12px;color:var(--text-muted);">${t}</div>
                </div>
                ${o}
            </section>`}get _uid(){return this.__uid||(this.__uid=Math.random().toString(36).slice(2,7)),this.__uid}}function ke(e){return e!=null&&e.length?e.map(Ne).join(""):'<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online</div>'}function Ne(e){var g;if(!e)return"";const t=e.profiles||{},i=t.name||"Member",o=t.emoji||"",n=t.avatar_url||"",r=e.status||"online",l=e.activity||"✨ Available",a=e.user_id,s=(g=window.Core)==null?void 0:g.getAvatarGradient(a||i),d=ye(i),u=Ee[r]||"offline",m=n?`<img src="${n}"
               style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
               alt="${d}" loading="lazy">`:o?`<span class="member-avatar-icon">${xe(o)}</span>`:`<span>${ye(i.charAt(0).toUpperCase())}</span>`;return`
        <div class="member-card-mini"
             onclick="window._activeMembersHandleView('${a}')"
             data-member-id="${a}"
             role="button"
             tabindex="0"
             aria-label="View ${d}'s profile"
             onkeydown="if(event.key==='Enter'||event.key===' '){
                 event.preventDefault();
                 window._activeMembersHandleView('${a}');
             }">
            <div class="member-mini-avatar"
                 style="${n?"background:transparent;":`background:${s};`}"
                 aria-hidden="true">
                ${m}
            </div>
            <div class="member-mini-status ${u}"
                 aria-label="${r}"
                 title="${Te(r)}"></div>
            <div class="member-mini-name">${d}</div>
            <div class="member-mini-info">${ye(l)}</div>
        </div>`}function ye(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function Te(e){return!e||typeof e!="string"?"":e.charAt(0).toUpperCase()+e.slice(1)}window._activeMembersHandleView=function(e){var t;e&&(window.MemberProfileModal?window.MemberProfileModal.open(e):(t=window.Core)==null||t.showToast("Member profiles loading..."))};window._openWhisperModal=async function(){var e,t;if(!window.WhisperModal)try{const i=await w(()=>Promise.resolve().then(()=>We),void 0);window.WhisperModal=i.WhisperModal??i.default}catch(i){console.warn("[ActiveMembers] WhisperModal failed to load:",i),(e=window.Core)==null||e.showToast("Whispers unavailable — please try again.");return}(t=window.WhisperModal)==null||t.open()};window.addEventListener("avatarChanged",e=>{const{userId:t,emoji:i,avatarUrl:o}=e.detail||{};t&&F._instances.forEach(n=>{n.updateMemberAvatar(t,{emoji:i,avatarUrl:o})})});window.ActiveMembers={async render(){F._instances.size>0&&F._instances.forEach(e=>e.refresh())},updateMemberStatus(e,t){F._instances.forEach(i=>i.updateMemberStatus(e,t))},updateMemberActivity(e,t){F._instances.forEach(i=>i.updateMemberActivity(e,t))},async refresh(){F._instances.forEach(e=>e.refresh())},get state(){return{isRendered:F._instances.size>0}}};const Ie={state:{isOpen:!1,view:"inbox",threadPartnerId:null,threadPartnerName:null,realtimeSub:null,bgSub:null},init(){if(document.getElementById("whisperModal"))return;const e=document.createElement("div");e.innerHTML=`
            <div id="whisperModal"
                 role="dialog" aria-modal="true" aria-label="Whispers"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);
                        align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">

                <div id="whisperModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);
                            border-radius:24px;padding:0;
                            width:min(580px,95vw);max-height:88vh;
                            position:relative;display:flex;flex-direction:column;
                            overflow:hidden;
                            box-shadow:12px 12px 32px rgba(0,0,0,0.18),-6px -6px 18px rgba(255,255,255,0.65);
                            transform:translateY(20px);transition:transform 0.25s ease;">

                    <!-- Header -->
                    <div id="whisperModalHeader"
                         style="display:flex;align-items:center;gap:12px;
                                padding:1.4rem 1.75rem 1.2rem;
                                border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;
                                background:var(--neuro-bg-lighter,#e8e8eb);">

                        <div style="width:38px;height:38px;border-radius:50%;
                                    background:var(--neuro-accent-a10,rgba(107,155,55,0.1));
                                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                 viewBox="0 0 24 24" fill="none" stroke="var(--neuro-accent)"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>

                        <div style="flex:1;min-width:0;">
                            <div id="whisperModalTitle"
                                 style="font-size:1.05rem;font-weight:700;
                                        color:var(--neuro-text);
                                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                Whispers
                            </div>
                            <div id="whisperModalSubtitle"
                                 style="font-size:0.75rem;color:var(--text-muted);
                                        margin-top:2px;display:none;
                                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            </div>
                        </div>

                        <button id="whisperBackBtn"
                                onclick="WhisperModal._showInbox()"
                                aria-label="All conversations"
                                style="display:none;background:var(--neuro-bg);
                                       border:1px solid rgba(0,0,0,0.1);
                                       border-radius:99px;padding:5px 14px;
                                       font-size:0.78rem;font-weight:600;
                                       color:var(--text-muted);cursor:pointer;
                                       white-space:nowrap;transition:background 0.15s,color 0.15s;">
                            All Whispers
                        </button>

                        <button onclick="WhisperModal.close()" aria-label="Close"
                                style="width:32px;height:32px;border-radius:50%;
                                       background:rgba(0,0,0,0.06);border:none;cursor:pointer;
                                       font-size:16px;color:var(--text-muted);line-height:1;
                                       display:flex;align-items:center;justify-content:center;
                                       flex-shrink:0;transition:background 0.15s;">✕</button>
                    </div>

                    <!-- Inbox view -->
                    <div id="whisperInboxView" style="flex:1;overflow-y:auto;padding:0.5rem 0;">
                        <div id="whisperInboxLoading"
                             style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading conversations...
                        </div>
                        <div id="whisperInboxEmpty"
                             style="display:none;text-align:center;padding:3.5rem 1.5rem;">
                            <div style="width:56px;height:56px;border-radius:50%;
                                        background:var(--neuro-accent-a10,rgba(107,155,55,0.1));
                                        display:flex;align-items:center;justify-content:center;
                                        margin:0 auto 1rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="var(--neuro-accent)"
                                     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <div style="font-size:0.95rem;font-weight:600;
                                        color:var(--neuro-text);margin-bottom:6px;">
                                No whispers yet
                            </div>
                            <div style="font-size:0.82rem;color:var(--text-muted);">
                                Visit a member's profile to send one.
                            </div>
                        </div>
                        <div id="whisperInboxList"></div>
                    </div>

                    <!-- Thread view -->
                    <div id="whisperThreadView"
                         style="display:none;flex:1;overflow-y:auto;
                                padding:1rem 1.25rem;flex-direction:column;gap:10px;">
                        <div id="whisperThreadLoading"
                             style="text-align:center;padding:3rem;
                                    color:var(--text-muted);font-size:0.88rem;">
                            Loading messages...
                        </div>
                        <div id="whisperThreadMessages"
                             style="display:flex;flex-direction:column;gap:10px;"></div>
                    </div>

                    <!-- Reply bar (thread only) -->
                    <div id="whisperReplyBar"
                         style="display:none;padding:1rem 1.25rem 1.25rem;
                                border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;
                                background:var(--neuro-bg-lighter,#e8e8eb);">
                        <div style="display:flex;gap:10px;align-items:flex-end;">
                            <textarea id="whisperReplyText" placeholder="Write a whisper…"
                                      maxlength="500" rows="2"
                                      onkeydown="WhisperModal._replyKeydown(event)"
                                      style="flex:1;padding:12px 14px;border-radius:14px;
                                             border:1.5px solid rgba(0,0,0,0.10);font-size:0.9rem;
                                             resize:none;background:var(--neuro-bg);
                                             color:var(--neuro-text);box-sizing:border-box;
                                             font-family:inherit;outline:none;
                                             box-shadow:inset 2px 2px 5px rgba(0,0,0,0.06);
                                             transition:border-color 0.15s;"
                                      onfocus="this.style.borderColor='var(--neuro-accent)'"
                                      onblur="this.style.borderColor='rgba(0,0,0,0.10)'"></textarea>
                            <button id="whisperReplyBtn" onclick="WhisperModal._sendReply()"
                                    style="padding:12px 20px;border-radius:14px;border:none;
                                           cursor:pointer;font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-accent,#6b9b37);color:#fff;
                                           white-space:nowrap;align-self:flex-end;
                                           box-shadow:3px 3px 8px rgba(0,0,0,0.12);
                                           transition:opacity 0.15s,transform 0.15s;"
                                    onmouseover="this.style.opacity='0.88';this.style.transform='translateY(-1px)'"
                                    onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">
                                Send
                            </button>
                        </div>
                        <div style="font-size:0.7rem;color:var(--text-muted);
                                    margin-top:6px;text-align:right;">
                            ⌘ + Enter to send
                        </div>
                    </div>
                </div>
            </div>`,document.body.appendChild(e.firstElementChild),document.getElementById("whisperModal").addEventListener("click",i=>{i.target.id==="whisperModal"&&this.close()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&this.state.isOpen&&this.close()});const t=()=>{c!=null&&c.ready?this.startBackgroundListener():setTimeout(t,500)};t()},async open(){this._openShared(),await this._showInbox()},async openThread(e,t,i,o){this._openShared(),await this._showThread(e,t,i,o)},_openShared(){this.init(),this._animateIn(),this.state.isOpen=!0,document.body.style.overflow="hidden",this._subscribeRealtime()},close(){const e=document.getElementById("whisperModal"),t=document.getElementById("whisperModalInner");e&&(e.style.opacity="0",t.style.transform="translateY(20px)",setTimeout(()=>{var i,o;e.style.display="none",this.state.isOpen=!1,this.state.view="inbox",this.state.threadPartnerId=null,document.body.style.overflow="",(o=(i=this.state.realtimeSub)==null?void 0:i.unsubscribe)==null||o.call(i),this.state.realtimeSub=null},250))},_animateIn(){const e=document.getElementById("whisperModal"),t=document.getElementById("whisperModalInner");e.style.display="flex",requestAnimationFrame(()=>{e.style.opacity="1",t.style.transform="translateY(0)"})},_setView(e){const t=e==="inbox";document.getElementById("whisperInboxView").style.display=t?"block":"none",document.getElementById("whisperThreadView").style.display=t?"none":"flex",document.getElementById("whisperReplyBar").style.display=t?"none":"block",document.getElementById("whisperBackBtn").style.display=t?"none":"inline-flex";const i=document.getElementById("whisperModalSubtitle");t&&(document.getElementById("whisperModalTitle").textContent="Whispers",i.style.display="none")},async _showInbox(){this.state.view="inbox",this.state.threadPartnerId=null,this._setView("inbox");const e=document.getElementById("whisperInboxLoading"),t=document.getElementById("whisperInboxEmpty"),i=document.getElementById("whisperInboxList");e.style.display="block",t.style.display="none",i.innerHTML="";const o=await c.getWhisperInbox();if(e.style.display="none",!o.length){t.style.display="block";return}i.innerHTML=o.map(n=>this._conversationRowHTML(n)).join(""),this._setBadge(o.reduce((n,r)=>n+r.unread,0))},_conversationRowHTML(e){const t=e.partner||{},i=this._escape(t.name||"Member"),o=this._avatarHTML(t,44),n=this._escape(e.lastMessage||""),r=this._relativeTime(e.lastAt),l=this._escape(t.id||""),a=this._escape(t.emoji||""),s=this._escape(t.avatar_url||""),d=e.unread>0;return`
            <div data-partner-id="${l}"
                 onclick="WhisperModal._showThread('${l}','${i}','${a}','${s}')"
                 style="display:flex;align-items:center;gap:14px;padding:0.9rem 1.75rem;
                        cursor:pointer;transition:background 0.15s;
                        border-bottom:1px solid rgba(0,0,0,0.04);"
                 onmouseover="this.style.background='rgba(0,0,0,0.03)'"
                 onmouseout="this.style.background='transparent'">

                <div style="position:relative;flex-shrink:0;">
                    ${o}
                    ${d?`<span style="position:absolute;top:-2px;right:-2px;
                        width:10px;height:10px;border-radius:50%;
                        background:var(--neuro-accent);
                        border:2px solid var(--neuro-bg);"></span>`:""}
                </div>

                <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;
                                align-items:baseline;gap:8px;margin-bottom:3px;">
                        <span class="whisper-partner-name"
                              style="font-weight:${d?"700":"500"};font-size:0.9rem;
                                     color:var(--neuro-text);white-space:nowrap;
                                     overflow:hidden;text-overflow:ellipsis;">
                            ${i}
                        </span>
                        <span style="font-size:0.7rem;color:var(--text-muted);flex-shrink:0;">
                            ${r}
                        </span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);
                                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                                font-weight:${d?"600":"400"};">
                        ${n}
                    </div>
                </div>

                <span class="whisper-unread-badge"
                      style="display:${d?"inline-flex":"none"};
                             background:var(--neuro-accent);color:#fff;
                             border-radius:99px;font-size:0.68rem;font-weight:700;
                             padding:2px 8px;min-width:20px;
                             text-align:center;flex-shrink:0;">
                    ${d?e.unread:""}
                </span>
            </div>`},async _showThread(e,t,i,o){var d;this.state.view="thread",this.state.threadPartnerId=e,this.state.threadPartnerName=t,this._setView("thread"),document.getElementById("whisperModalTitle").textContent=t;const n=document.getElementById("whisperModalSubtitle");n.textContent="Private whisper thread",n.style.display="block";const r=document.getElementById("whisperThreadLoading"),l=document.getElementById("whisperThreadMessages"),a=document.getElementById("whisperThreadView");r.style.display="block",l.innerHTML="";const[s]=await Promise.all([c.getWhispers(e),c.markConversationRead(e)]);r.style.display="none",this._renderThreadMessages(s),setTimeout(()=>{a.scrollTop=a.scrollHeight},50),(d=document.getElementById("whisperReplyText"))==null||d.focus(),await this.refreshUnreadBadge()},_renderThreadMessages(e){const t=document.getElementById("whisperThreadMessages");if(!t)return;if(!e.length){t.innerHTML=`
                <div style="text-align:center;padding:3rem;
                            color:var(--text-muted);font-size:0.85rem;">
                    No messages yet — say something ✨
                </div>`;return}const i=c._uid;t.innerHTML=e.map(o=>{var r;const n=o.sender_id===i||((r=o.sender)==null?void 0:r.id)===i;return this._messageBubbleHTML(n,this._escape(o.message),this._relativeTime(o.created_at))}).join("")},_appendMessage(e){var n,r;const t=document.getElementById("whisperThreadMessages");if(!t)return;(n=t.querySelector("[data-empty]"))==null||n.remove();const i=e.sender_id===c._uid,o=document.createElement("div");o.innerHTML=this._messageBubbleHTML(i,this._escape(e.message),this._relativeTime(e.created_at)),t.appendChild(o.firstElementChild),(r=document.getElementById("whisperThreadView"))==null||r.scrollTo({top:999999})},_messageBubbleHTML(e,t,i){return`
            <div style="display:flex;flex-direction:column;
                        align-items:${e?"flex-end":"flex-start"};gap:3px;">
                <div style="max-width:75%;padding:10px 14px;
                            border-radius:${e?"18px 18px 4px 18px":"18px 18px 18px 4px"};
                            background:${e?"var(--neuro-accent,#6b9b37)":"rgba(0,0,0,0.06)"};
                            color:${e?"#fff":"var(--neuro-text)"};
                            font-size:0.9rem;line-height:1.5;word-break:break-word;
                            box-shadow:${e?"2px 3px 8px rgba(0,0,0,0.12)":"inset 1px 1px 4px rgba(0,0,0,0.05)"};">
                    ${t}
                </div>
                <span style="font-size:0.68rem;color:var(--text-muted);padding:0 4px;">
                    ${i}
                </span>
            </div>`},async _sendReply(){const e=document.getElementById("whisperReplyText"),t=e==null?void 0:e.value.trim();if(!t||!this.state.threadPartnerId)return;const i=document.getElementById("whisperReplyBtn");i&&(i.disabled=!0,i.textContent="…"),e.disabled=!0;try{await c.sendWhisper(this.state.threadPartnerId,t)?(e.value="",this._appendMessage({sender_id:c._uid,message:t,created_at:new Date().toISOString()})):window.Core.showToast("Could not send — please try again")}catch(o){console.error("[WhisperModal] sendReply:",o),window.Core.showToast("Could not send — please try again")}finally{i&&(i.disabled=!1,i.textContent="Send"),e.disabled=!1,e.focus()}},_replyKeydown(e){e.key==="Enter"&&(e.metaKey||e.ctrlKey)&&(e.preventDefault(),this._sendReply())},_subscribeRealtime(){var e,t;(t=(e=this.state.realtimeSub)==null?void 0:e.unsubscribe)==null||t.call(e),this.state.realtimeSub=c.subscribeToWhispers(i=>{var o;this.state.view==="thread"&&i.sender_id===this.state.threadPartnerId?(this._appendMessage(i),c.markConversationRead(i.sender_id).catch(()=>{})):(window.Core.showToast(`New whisper from ${((o=i.sender)==null?void 0:o.name)||"Someone"}`),this.state.view==="inbox"?this._showInbox():this.refreshUnreadBadge())})},async refreshUnreadBadge(){this._setBadge(await c.getUnreadWhisperCount().catch(()=>0))},_setBadge(e){const t=document.getElementById("whisperUnreadBadge");t&&(t.textContent=e>99?"99+":e,t.style.display=e>0?"inline-flex":"none")},startBackgroundListener(){this.state.bgSub||c!=null&&c.ready&&(this.refreshUnreadBadge().catch(()=>{}),this.state.bgSub=c.subscribeToWhispersBackground(e=>{this.state.isOpen&&this.state.view==="thread"&&e.sender_id===this.state.threadPartnerId||this.refreshUnreadBadge().catch(()=>{})}))},_avatarHTML(e,t=44){const i=t+"px";if(e!=null&&e.avatar_url)return`<img src="${e.avatar_url}"
                         width="${t}" height="${t}" loading="lazy" decoding="async"
                         style="width:${i};height:${i};border-radius:50%;
                                object-fit:cover;display:block;"
                         alt="${this._escape(e.name||"")}">`;const o=window.Core.getAvatarGradient((e==null?void 0:e.id)||""),n=(e==null?void 0:e.emoji)||((e==null?void 0:e.name)||"?").charAt(0).toUpperCase();return`<div style="width:${i};height:${i};border-radius:50%;
                            background:${o};
                            display:flex;align-items:center;justify-content:center;
                            font-size:${Math.round(t*.42)}px;flex-shrink:0;
                            box-shadow:2px 2px 6px rgba(0,0,0,0.1);">
                    ${this._escape(n)}
                </div>`},_relativeTime(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),i=Math.floor(t/6e4);if(i<1)return"just now";if(i<60)return`${i}m ago`;const o=Math.floor(i/60);if(o<24)return`${o}h ago`;const n=Math.floor(o/24);return n<7?`${n}d ago`:new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})},_escape(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}};window.WhisperModal=Ie;const We=Object.freeze(Object.defineProperty({__proto__:null,WhisperModal:Ie},Symbol.toStringTag,{value:"Module"}));function Fe(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var be={exports:{}},Me;function Ge(){return Me||(Me=1,(function(e,t){(function(){var i=Math.PI,o=Math.sin,n=Math.cos,r=Math.tan,l=Math.asin,a=Math.atan2,s=Math.acos,d=i/180,u=1e3*60*60*24,m=2440588,g=2451545;function h(p){return p.valueOf()/u-.5+m}function v(p){return new Date((p+.5-m)*u)}function b(p){return h(p)-g}var x=d*23.4397;function I(p,f){return a(o(p)*n(x)-r(f)*o(x),n(p))}function P(p,f){return l(o(f)*n(x)+n(f)*o(x)*o(p))}function Y(p,f,y){return a(o(p),n(p)*o(f)-r(y)*n(f))}function z(p,f,y){return l(o(f)*o(y)+n(f)*n(y)*n(p))}function ee(p,f){return d*(280.16+360.9856235*p)-f}function K(p){return p<0&&(p=0),2967e-7/Math.tan(p+.00312536/(p+.08901179))}function X(p){return d*(357.5291+.98560028*p)}function ne(p){var f=d*(1.9148*o(p)+.02*o(2*p)+3e-4*o(3*p)),y=d*102.9372;return p+f+y+i}function re(p){var f=X(p),y=ne(f);return{dec:P(y,0),ra:I(y,0)}}var R={};R.getPosition=function(p,f,y){var M=d*-y,_=d*f,E=b(p),C=re(E),T=ee(E,M)-C.ra;return{azimuth:Y(T,_,C.dec),altitude:z(T,_,C.dec)}};var te=R.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];R.addTime=function(p,f,y){te.push([p,f,y])};var ae=9e-4;function ce(p,f){return Math.round(p-ae-f/(2*i))}function se(p,f,y){return ae+(p+f)/(2*i)+y}function le(p,f,y){return g+p+.0053*o(f)-.0069*o(2*y)}function ue(p,f,y){return s((o(p)-o(f)*o(y))/(n(f)*n(y)))}function pe(p){return-2.076*Math.sqrt(p)/60}function me(p,f,y,M,_,E,C){var T=ue(p,y,M),$=se(T,f,_);return le($,E,C)}R.getTimes=function(p,f,y,M){M=M||0;var _=d*-y,E=d*f,C=pe(M),T=b(p),$=ce(T,_),H=se(0,_,$),O=X(H),G=ne(O),J=P(G,0),N=le(H,O,G),q,ie,W,U,V,oe,D={solarNoon:v(N),nadir:v(N-.5)};for(q=0,ie=te.length;q<ie;q+=1)W=te[q],U=(W[0]+C)*d,V=me(U,_,E,J,$,O,G),oe=N-(V-N),D[W[1]]=v(oe),D[W[2]]=v(V);return D};function de(p){var f=d*(218.316+13.176396*p),y=d*(134.963+13.064993*p),M=d*(93.272+13.22935*p),_=f+d*6.289*o(y),E=d*5.128*o(M),C=385001-20905*n(y);return{ra:I(_,E),dec:P(_,E),dist:C}}R.getMoonPosition=function(p,f,y){var M=d*-y,_=d*f,E=b(p),C=de(E),T=ee(E,M)-C.ra,$=z(T,_,C.dec),H=a(o(T),r(_)*n(C.dec)-o(C.dec)*n(T));return $=$+K($),{azimuth:Y(T,_,C.dec),altitude:$,distance:C.dist,parallacticAngle:H}},R.getMoonIllumination=function(p){var f=b(p||new Date),y=re(f),M=de(f),_=149598e3,E=s(o(y.dec)*o(M.dec)+n(y.dec)*n(M.dec)*n(y.ra-M.ra)),C=a(_*o(E),M.dist-_*n(E)),T=a(n(y.dec)*o(y.ra-M.ra),o(y.dec)*n(M.dec)-n(y.dec)*o(M.dec)*n(y.ra-M.ra));return{fraction:(1+n(C))/2,phase:.5+.5*C*(T<0?-1:1)/Math.PI,angle:T}};function Z(p,f){return new Date(p.valueOf()+f*u/24)}R.getMoonTimes=function(p,f,y,M){var _=new Date(p);M?_.setUTCHours(0,0,0,0):_.setHours(0,0,0,0);for(var E=.133*d,C=R.getMoonPosition(_,f,y).altitude-E,T,$,H,O,G,J,N,q,ie,W,U,V,oe,D=1;D<=24&&(T=R.getMoonPosition(Z(_,D),f,y).altitude-E,$=R.getMoonPosition(Z(_,D+1),f,y).altitude-E,G=(C+$)/2-T,J=($-C)/2,N=-J/(2*G),q=(G*N+J)*N+T,ie=J*J-4*G*T,W=0,ie>=0&&(oe=Math.sqrt(ie)/(Math.abs(G)*2),U=N-oe,V=N+oe,Math.abs(U)<=1&&W++,Math.abs(V)<=1&&W++,U<-1&&(U=V)),W===1?C<0?H=D+U:O=D+U:W===2&&(H=D+(q<0?V:U),O=D+(q<0?U:V)),!(H&&O));D+=2)C=$;var he={};return H&&(he.rise=Z(_,H)),O&&(he.set=Z(_,O)),!H&&!O&&(he[q>0?"alwaysUp":"alwaysDown"]=!0),he},e.exports=R})()})(be)),be.exports}var qe=Ge();const rt=Fe(qe),k={state:{currentUser:{id:null,name:"Loading...",avatar:"?",emoji:"",avatar_url:null,bio:"",status:"online",role:"Member",karma:0,xp:0,badges:[],minutes:0,circles:0,offered:0,birthday:null,country:null,email:"",is_admin:!1},currentRoom:null,currentActivity:"✨ Available",presenceCount:0,presenceInterval:null,pulseSent:!1,timerRunning:!1,timeLeft:1200,currentView:"hubView",initialized:!1},config:{ROOM_MODULES:["SilentRoom","CampfireRoom","GuidedRoom","BreathworkRoom","OshoRoom","DeepWorkRoom","TarotRoom","ReikiRoom"],STATUS_RINGS:{silent:"#60a5fa",available:"#34d399",guiding:"#fbbf24",deep:"#a78bfa",resonant:"#f472b6",offline:"#d1d5db"},AVATAR_GRADIENTS:["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)","linear-gradient(135deg, #fa709a 0%, #fee140 100%)"],ADMIN_MODULES:["CollectiveField","LunarEngine","SolarEngine","UpcomingEvents","AdminDashboard"],RENDER_DELAY:100,CELESTIAL_INIT_DELAY:500,CELESTIAL_POLL_MAX:25,PRESENCE_INTERVAL:3e4,HEARTBEAT_INTERVAL:6e4,PULSE_COOLDOWN:6e4},async init(){var e,t;if(this.state.initialized){console.warn("[Core] Already initialized");return}try{if(!await c.init())throw new Error("Database not ready - is the user logged in?");if(await this.loadCurrentUser(),!this.state.currentUser.avatar_url){const o=(t=(e=window.app)==null?void 0:e.state)==null?void 0:t.currentUser,n=(o==null?void 0:o.avatarUrl)||(o==null?void 0:o.avatar_url)||null;n&&(this.state.currentUser.avatar_url=n)}if(await c.setPresence(this.state.currentUser.status||"online",this.state.currentUser.activity||"✨ Available",null),c.startHeartbeat(this.config.HEARTBEAT_INTERVAL),window.addEventListener("pagehide",()=>{c.setOffline(),c.unsubscribeAll()}),this.setupEventListeners(),this.initializeSafetyModals(),this.initializeModules(),this.initializePracticeRooms(),this.scheduleRoomRendering(),this.scheduleCelestialInit(),this.updatePresenceCount(),setTimeout(()=>this._injectAdminUIAll(),1e3),this.state.initialized=!0,window._pendingHubScrollTarget){const o=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,(()=>{let l=0,a=0,s=0;const d=setInterval(()=>{if(l++,document.body.classList.contains("ritual-active")){a=0,s=0;return}const u=document.getElementById(o),m=u?u.offsetHeight:0;if(m>10&&(m===a?s++:s=0,a=m),(s>=3||l>=60)&&m>0){clearInterval(d);const h=document.getElementById("mobile-bottom-bar"),v=h?h.offsetHeight+16:16;requestAnimationFrame(()=>{const b=u.getBoundingClientRect().top+window.scrollY-v;window.scrollTo({top:b,behavior:"smooth"})})}else l>=60&&clearInterval(d)},100)})()}}catch(i){console.error("❌ [Core] Initialization failed:",i),this.handleInitializationError(i)}},async loadCurrentUser(){var e,t,i,o,n,r,l,a,s;try{const d=await c.getMyProfile();if(!d){console.warn("[Core] No profile found for current user");return}const m=new Set(["online","available","away","guiding","silent","deep","offline"]).has(d.community_status)?d.community_status:"online";this.state.currentUser={id:d.id,name:d.name||"Anonymous",avatar:(d.name||"A").charAt(0).toUpperCase(),emoji:d.emoji||"",avatar_url:d.avatar_url||null,bio:d.inspiration||"Here to practice with intention.",status:m,community_status:m,role:d.is_admin?"Admin":d.community_role||"Member",community_role:d.community_role||"Member",minutes:d.total_minutes||0,circles:d.total_sessions||0,offered:d.gifts_given||0,birthday:d.birthday||null,country:d.country||null,email:d.email||"",is_admin:!!d.is_admin,karma:((i=(t=(e=window.app)==null?void 0:e.gamification)==null?void 0:t.state)==null?void 0:i.karma)??0,xp:((r=(n=(o=window.app)==null?void 0:o.gamification)==null?void 0:n.state)==null?void 0:r.xp)??0,badges:((s=(a=(l=window.app)==null?void 0:l.gamification)==null?void 0:a.state)==null?void 0:s.badges)??[]}}catch(d){console.error("[Core] loadCurrentUser failed:",d)}},initializeModules(){var t;const e=[{name:"Rituals",instance:window.Rituals},{name:"ProfileModule",instance:window.ProfileModule},{name:"CommunityModule",instance:window.CommunityModule}];for(const{name:i,instance:o}of e)if(o!=null&&o.init)try{o.init()}catch(n){console.error(`✗ [Core] ${i} init failed:`,n)}else console.warn(`⚠ [Core] ${i} not found or missing init()`);(t=window.ActiveMembers)!=null&&t.render?window.ActiveMembers.render().catch(i=>console.error("✗ [Core] ActiveMembers.render() failed:",i)):console.warn("⚠ [Core] ActiveMembers not found")},_injectAdminUIAll(){for(const e of this.config.ADMIN_MODULES){const t=window[e];if(t!=null&&t.injectAdminUI)try{t.injectAdminUI()}catch(i){console.warn(`[Core] injectAdminUI failed on ${e}:`,i)}}},handleInitializationError(e){this.showToast("Failed to initialize. Please refresh the page."),console.error("[Core] Init error details:",{message:e.message,stack:e.stack,state:this.state})},initializePracticeRooms(){const e=[];for(const t of this.config.ROOM_MODULES){const i=window[t];if(!i){console.warn(`⚠ [Core] ${t} not found on window`);continue}if(!i.init){console.warn(`⚠ [Core] ${t} missing init()`);continue}try{i.init(),e.push(i)}catch(o){console.error(`✗ [Core] ${t} init failed:`,o)}}window.PracticeRoom&&e.length&&PracticeRoom.startHubPresence(e)},scheduleRoomRendering(){setTimeout(()=>{try{this.renderRooms()}catch(e){console.error("[Core] Room rendering failed:",e)}},this.config.RENDER_DELAY)},renderRooms(){const e=document.getElementById("roomsGrid");if(!e){console.warn("[Core] #roomsGrid not found - skipping render");return}const t=this.config.ROOM_MODULES.reduce((i,o)=>{const n=window[o];if(!(n!=null&&n.getRoomCardHTML))return console.warn(`⚠ [Core] ${o} missing getRoomCardHTML()`),i;try{const r=n.getRoomCardHTML();r&&i.push(r)}catch(r){console.error(`✗ [Core] getRoomCardHTML failed for ${o}:`,r)}return i},[]);t.length?e.innerHTML=t.join(""):console.warn("[Core] No room cards to render")},scheduleCelestialInit(){setTimeout(()=>{try{this.initializeCelestialSystems()}catch(e){console.error("[Core] Celestial init failed:",e)}},this.config.CELESTIAL_INIT_DELAY)},initializeCelestialSystems(){for(const[e,t]of[["LunarEngine",window.LunarEngine],["SolarEngine",window.SolarEngine]])if(t!=null&&t.init)try{t.init()}catch(i){console.error(`✗ [Core] ${e} init failed:`,i)}else console.warn(`⚠ [Core] ${e} not found`)},navigateTo(e){var t,i;try{const o=document.getElementById("communityHubFullscreenContainer"),n=document.getElementById("community-hub-tab");e==="hubView"?(o&&(o.style.display="none"),n&&(n.style.display="block"),document.body.style.overflow="",document.querySelectorAll("#hubView").forEach(r=>r.classList.add("active")),this.state.currentView="hubView"):e==="practiceRoomView"?(o&&(o.style.display="flex",(t=o.querySelector("#openingOverlay"))==null||t.classList.remove("active"),(i=o.querySelector("#closingOverlay"))==null||i.classList.remove("active")),n?n.style.display="none":console.error("[Core] Hub tab element not found"),document.body.style.overflow="hidden",this.state.currentView="practiceRoomView"):console.warn(`[Core] Unknown viewId: "${e}"`)}catch(o){console.error("[Core] Navigation error:",o)}},setupEventListeners(){document.addEventListener("click",e=>{e.target.classList.contains("modal-overlay")&&e.target.classList.remove("active")}),document.addEventListener("keydown",e=>{var t;e.key==="Escape"&&((t=document.querySelector(".modal-overlay.active"))==null||t.classList.remove("active"))})},async updatePresenceCount(){this.state.presenceInterval&&clearInterval(this.state.presenceInterval);const e=async()=>{try{if(!c.ready)return;const t=await c.getActiveMembers();this.state.presenceCount=t.length;const i=document.getElementById("presenceCount");i&&(i.textContent=t.length)}catch(t){console.error("[Core] updatePresenceCount error:",t)}};await e(),this.state.presenceInterval=setInterval(e,this.config.PRESENCE_INTERVAL)},sendPulse(){if(this.state.pulseSent){this.showToast("Please wait before sending another pulse");return}this.state.pulseSent=!0,this.showToast("Pulse sent to the community"),setTimeout(()=>{this.state.pulseSent=!1},this.config.PULSE_COOLDOWN)},showToast(e,t=3e3){const i=document.getElementById("toast");if(!i){console.warn("[Core] #toast element not found");return}i.textContent=e,i.classList.add("show"),setTimeout(()=>i.classList.remove("show"),t)},initializeSafetyModals(){document.getElementById("reportModal")||document.body.insertAdjacentHTML("beforeend",`
            <!-- Report Modal -->
            <div class="modal-overlay" id="reportModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close report modal" onclick="CommunityModule.closeReportModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Report Issue</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px; color:var(--text-muted);">Help us maintain a safe space. Your report is confidential.</p>
                        <label for="reportReason" style="display:block; margin-bottom:8px; font-weight:600;">Reason:</label>
                        <select id="reportReason" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); margin-bottom:16px;">
                            <option value="">Select a reason...</option>
                            <option value="harassment">Harassment or bullying</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="spam">Spam or advertising</option>
                            <option value="safety">Safety concern</option>
                            <option value="other">Other</option>
                        </select>
                        <label for="reportDetails" style="display:block; margin-bottom:8px; font-weight:600;">Details (optional):</label>
                        <textarea id="reportDetails" rows="4" placeholder="Please provide any additional context..." style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); resize:vertical; margin-bottom:16px;"></textarea>
                        <div style="display:flex; gap:12px;">
                            <button type="button" onclick="CommunityModule.closeReportModal()" style="flex:1; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="button" onclick="CommunityModule.submitReport()" style="flex:1; padding:12px; background:var(--accent); color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Submit Report</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Block Modal -->
            <div class="modal-overlay" id="blockModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close block modal" onclick="CommunityModule.closeBlockModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Block User</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px; color:var(--text-muted);">Blocking will hide all messages from this user.</p>
                        <label for="blockUsername" style="display:block; margin-bottom:8px; font-weight:600;">Username:</label>
                        <input type="text" id="blockUsername" placeholder="Enter username to block" autocomplete="off" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); margin-bottom:16px;" />
                        <div style="display:flex; gap:12px;">
                            <button type="button" onclick="CommunityModule.closeBlockModal()" style="flex:1; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="button" onclick="CommunityModule.confirmBlock()" style="flex:1; padding:12px; background:#e74c3c; color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Block User</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Help Modal -->
            <div class="modal-overlay" id="helpModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close help modal" onclick="CommunityModule.closeHelpModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg> Get Help</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px;">If you're experiencing a crisis or need immediate support:</p>
                        <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
                            <h3 style="margin-top:0; font-size:16px;">Crisis Resources</h3>
                            <p style="margin:8px 0;"><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                            <p style="margin:8px 0;"><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                            <p style="margin:8px 0;"><strong>International:</strong> <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">findahelpline.com</a></p>
                        </div>
                        <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
                            <h3 style="margin-top:0; font-size:16px;">Community Support</h3>
                            <p style="margin:8px 0;">Contact our moderators for non-emergency concerns</p>
                            <p style="margin:8px 0;"><strong>Email:</strong> support@community.example.com</p>
                        </div>
                        <button type="button" onclick="CommunityModule.closeHelpModal()" style="width:100%; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Close</button>
                    </div>
                </div>
            </div>
        `)},formatTime(e){if(typeof e!="number"||e<0)return"0:00";const t=Math.floor(e/60),i=Math.floor(e%60);return`${t}:${i.toString().padStart(2,"0")}`},getAvatarGradient(e){(!e||typeof e!="string")&&(e="default");const t=e.split("").reduce((i,o)=>i+o.charCodeAt(0),0);return this.config.AVATAR_GRADIENTS[Math.abs(t)%this.config.AVATAR_GRADIENTS.length]}};window.Core=k;const Ce=["Enter with intention, leave with gratitude","This space holds you. Enter with presence.","Breathe in. You are welcome here.","Leave the noise behind. Step into stillness.","You are exactly where you need to be.","Enter gently. This moment is yours.","Set down what you carry. Enter with an open heart.","The space is ready. So are you.","Come as you are. This is a place of welcome.","Arrive fully. Begin with intention."];class Ve{constructor(t){this.app=t,this.initialized=!1,this._activeMembersWidget=null}async render(){const t=document.getElementById("community-hub-tab");if(!t){console.error("[CommunityHub] Tab element not found");return}if(this.createFullscreenRoomContainer(),this.initialized||(t.innerHTML=this._buildTabHTML()),requestAnimationFrame(()=>requestAnimationFrame(()=>this._showRitualImmediately())),this.initialized?this._refreshHubPresence():(await this.initializeCommunityHub(),this.initialized=!0),this._attachHubVisibility(),window._pendingHubScrollTarget){const i=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,requestAnimationFrame(()=>requestAnimationFrame(()=>{const o=document.getElementById(i);o&&o.scrollIntoView({behavior:"smooth",block:"start"})}))}if(window._pendingRoomOpen){const i=window._pendingRoomOpen;window._pendingRoomOpen=null;const o=window[`${i}_enterRoom`];if(typeof o=="function")o();else{const n=r=>{var l,a;((l=r.detail)==null?void 0:l.roomKey)===i&&(document.removeEventListener("practiceRoomReady",n),(a=window[`${i}_enterRoom`])==null||a.call(window))};document.addEventListener("practiceRoomReady",n),setTimeout(()=>document.removeEventListener("practiceRoomReady",n),8e3)}}}_buildTabHTML(){return`
      <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavCommunity.webp');
                         --header-title:'';
                         --header-tag:'A space for mindful practice and togetherness'">
            <h1>Community Hub</h1>
            <h3>A space for mindful practice and togetherness</h3>
            <span class="header-sub"></span>
          </header>

            <div class="season-flash" id="seasonFlash" aria-live="polite"></div>

            <a href="https://chat.whatsapp.com/HQGczWRf70tGqIspByIrL4"
               target="_blank" rel="noopener noreferrer"
               class="whatsapp-float"
               aria-label="Join our Community Chat on WhatsApp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                   alt="" width="24" height="24" aria-hidden="true" role="presentation">
              <span>Join our Community Chat</span>
            </a>

            <div id="hubView" class="view active">
              <div id="profileHeroContainer"></div>

              <div class="sanctuary-content">
                <div id="activeMembersContainer"></div>
                <div id="collectiveFieldContainer"></div>
                <div id="resonanceContainer"></div>

                <section class="section" aria-labelledby="practiceSpacesTitle">
                  <div class="section-header">
                    <div class="section-title" id="practiceSpacesTitle">Practice Spaces</div>
                  </div>
                  <div class="rooms-grid" id="roomsGrid"></div>
                </section>

                <section class="section" id="celestialLunarSection" aria-labelledby="celestialCyclesTitle">
                  <div class="section-header">
                    <div class="section-title" id="celestialCyclesTitle">Celestial Cycles</div>
                  </div>
                  <div id="lunarContainer" class="celestial-container"></div>
                </section>

                <section class="section" id="celestialSolarSection" aria-label="Solar Cycles">
                  <div id="solarContainer" class="celestial-container"></div>
                </section>

                <div id="communityReflectionsContainer"></div>
                <div id="upcomingEventsContainer"></div>
              </div>
            </div>

        </div>
    `}_buildCandleSVG(t){return`
      <svg viewBox="0 0 48 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="flame-outer" cx="24" cy="16" rx="7" ry="11" fill="url(#flameGradOuter-${t})" opacity="0.9"/>
        <ellipse class="flame-inner" cx="24" cy="18" rx="4.5" ry="7.5" fill="url(#flameGradInner-${t})" opacity="0.95"/>
        <ellipse class="flame-core"  cx="24" cy="20" rx="2" ry="3.5" fill="#fff9e6" opacity="0.95"/>
        <line x1="24" y1="26" x2="24" y2="29" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="14" y="29" width="20" height="34" rx="3" fill="url(#candleGrad-${t})"/>
        <path d="M14 35 Q11 38 12 43 Q13 46 14 48 L14 35Z" fill="url(#dripGrad-${t})" opacity="0.7"/>
        <path d="M34 38 Q37 41 36 46 Q35 48 34 49 L34 38Z" fill="url(#dripGrad-${t})" opacity="0.5"/>
        <ellipse cx="24" cy="29" rx="10" ry="2.5" fill="url(#topGrad-${t})"/>
        <rect x="17" y="31" width="4" height="28" rx="2" fill="white" opacity="0.08"/>
        <defs>
          <radialGradient id="flameGradOuter-${t}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#ffe066"/>
            <stop offset="50%"  stop-color="#ff9a00"/>
            <stop offset="100%" stop-color="#ff4400" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameGradInner-${t}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#fff5c0"/>
            <stop offset="60%"  stop-color="#ffb830"/>
            <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="candleGrad-${t}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#c8a882"/>
            <stop offset="40%"  stop-color="#e8d0b0"/>
            <stop offset="70%"  stop-color="#d4b88a"/>
            <stop offset="100%" stop-color="#b89060"/>
          </linearGradient>
          <linearGradient id="dripGrad-${t}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#e8d0b0"/>
            <stop offset="100%" stop-color="#c8a882" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="topGrad-${t}" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#f0dfc0"/>
            <stop offset="100%" stop-color="#c8a882"/>
          </radialGradient>
        </defs>
      </svg>`}_buildRitualCard({id:t,textId:i,type:o,action:n,label:r,buttonText:l}){return`
      <div class="ritual-overlay ${o}" id="${t}" role="dialog" aria-modal="true" aria-labelledby="${i}">
        <div class="ritual-card">
          <div class="ritual-candle" aria-hidden="true">${this._buildCandleSVG(o[0])}</div>
          <div class="ritual-text" id="${i}"></div>
          <button class="ritual-btn" data-action="${n}" aria-label="${r}">${l}</button>
        </div>
      </div>`}createFullscreenRoomContainer(){if(document.getElementById("communityHubFullscreenContainer"))return;const t=document.createElement("div");if(t.id="communityHubFullscreenContainer",t.style.cssText="position:fixed;inset:0;z-index:99999;background:transparent;display:none;overflow:auto;pointer-events:auto;",t.innerHTML=`
      ${this._buildRitualCard({id:"closingOverlay",textId:"closingRitualText",type:"closing",action:"ritual-closing",label:"Close gently",buttonText:"Close Gently"})}
      <div id="dynamicRoomContent" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;width:100%;"></div>
    `,document.body.appendChild(t),!document.getElementById("openingOverlay")){const i=document.createElement("div");i.innerHTML=this._buildRitualCard({id:"openingOverlay",textId:"openingRitualText",type:"opening",action:"ritual-opening",label:"Enter the space",buttonText:"Enter the Space"}),(document.getElementById("app-container")||document.body).appendChild(i.firstElementChild)}}_showRitualImmediately(){var o,n;if((n=(o=window.Rituals)==null?void 0:o.state)!=null&&n.hasSeenOpening)return;const t=document.getElementById("openingOverlay");if(!t)return;const i=document.getElementById("openingRitualText");i&&(i.textContent=`"${Ce[Math.floor(Math.random()*Ce.length)]}"`),document.body.classList.add("ritual-active"),t.classList.add("active"),setTimeout(()=>{window.Rituals?window.Rituals.completeOpening():(t.classList.remove("active"),document.body.classList.remove("ritual-active"))},5e3)}_refreshHubPresence(){var t,i,o,n;try{(t=this._activeMembersWidget)==null||t.refresh(),(o=(i=window.PracticeRoom)==null?void 0:i._hubRooms)!=null&&o.length&&PracticeRoom.startHubPresence(),(n=window.CollectiveFieldDB)!=null&&n.refreshCount&&window.CollectiveFieldDB.refreshCount()}catch(r){console.warn("[CommunityHub] _refreshHubPresence fallback to Core.init",r),k.state.initialized=!1,k.init()}}_preloadYouTubeAPI(){var i;if((i=window.YT)!=null&&i.Player||document.querySelector('script[src*="youtube.com/iframe_api"]'))return;const t=document.createElement("script");t.src="https://www.youtube.com/iframe_api",t.async=!0,document.head.appendChild(t)}_attachHubVisibility(){this._hubVisibilityHandler||(this._hubVisibilityHandler=()=>{var t,i;if(document.hidden)(t=this._hubChatRooms)==null||t.forEach(o=>{try{c.unsubscribeFromRoomChat(o)}catch{}});else{const o=(i=k==null?void 0:k.state)==null?void 0:i.currentRoom;o&&this._hubChatResubscribe&&this._hubChatResubscribe(o)}},document.addEventListener("visibilitychange",this._hubVisibilityHandler))}registerHubChatRooms(t,i){this._hubChatRooms=t,this._hubChatResubscribe=i}loadStylesheet(t,{critical:i=!1}={}){if(document.querySelector(`link[href="${t}"]`))return;const o=document.createElement("link");o.rel="stylesheet",o.href=t,i||(o.rel="preload",o.as="style",o.onload=function(){this.rel="stylesheet"}),document.head.appendChild(o)}loadScript(t){return new Promise((i,o)=>{if(document.querySelector(`script[src="${t}"]`))return i();const n=Object.assign(document.createElement("script"),{src:t,async:!0});n.onload=i,n.onerror=()=>o(new Error(`Failed to load: ${t}`)),document.body.appendChild(n)})}async _initAdminDashboard(){var i;const t=(i=k==null?void 0:k.state)==null?void 0:i.currentUser;if(!(!(t!=null&&t.isAdmin)&&!(t!=null&&t.isModerator)))try{await w(()=>Promise.resolve().then(()=>Xe),void 0)}catch(o){console.warn("[CommunityHub] AdminDashboard failed to load:",o)}}async initializeCommunityHub(){var t,i,o,n,r,l;try{if(this._preloadYouTubeAPI(),await Promise.all([w(()=>Promise.resolve().then(()=>Ke),void 0),w(()=>Promise.resolve().then(()=>Ze),void 0),w(()=>Promise.resolve().then(()=>Je),void 0),w(()=>Promise.resolve().then(()=>Qe),void 0),w(()=>Promise.resolve().then(()=>et),void 0),w(()=>Promise.resolve().then(()=>tt),void 0)]),await Promise.all([w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.Y),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.C),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.a),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.S),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.T),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.b),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.c),[])]),await w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.P),[]),!(k!=null&&k.init))throw new Error("Core module not found");await c.init(),window.CommunityDB=c,await k.init(),window.Core=k;const a=document.getElementById("activeMembersContainer");if(a&&((t=this._activeMembersWidget)==null||t.destroy(),this._activeMembersWidget=new Oe(a),this._activeMembersWidget.render()),await Promise.all([Promise.all([w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.s),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.g),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.o),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.d),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.e),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.f),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.t),[]),w(()=>import("./community-rooms-DHnyYGCb.js").then(s=>s.r),[])]),w(()=>import("./community-lunar-Uo-1Su-Q.js").then(s=>s.l),__vite__mapDeps([0,1])).then(()=>w(()=>import("./community-lunar-Uo-1Su-Q.js").then(s=>s.a),__vite__mapDeps([0,1]))).then(()=>w(()=>import("./community-lunar-Uo-1Su-Q.js").then(s=>s.b),__vite__mapDeps([0,1]))).then(()=>w(()=>import("./community-lunar-Uo-1Su-Q.js").then(s=>s.c),__vite__mapDeps([0,1]))),w(()=>import("./community-solar-FU_xwlLn.js").then(s=>s.s),__vite__mapDeps([2,1])).then(()=>w(()=>import("./community-solar-FU_xwlLn.js").then(s=>s.a),__vite__mapDeps([2,1]))).then(()=>w(()=>import("./community-solar-FU_xwlLn.js").then(s=>s.c),__vite__mapDeps([2,1]))).then(()=>w(()=>import("./community-solar-FU_xwlLn.js").then(s=>s.b),__vite__mapDeps([2,1]))),w(()=>Promise.resolve().then(()=>ot),void 0),w(()=>Promise.resolve().then(()=>it),void 0),this._initAdminDashboard()]),(o=(i=window.LunarEngine)==null?void 0:i.init)==null||o.call(i),(n=window.CollectiveField)==null||n.render(),(r=window.Resonance)==null||r.render(),(l=window.UpcomingEvents)==null||l.render(),window.ProfileModule){window.ProfileModule.state.isInitialized=!1;try{window.ProfileModule.init()}catch(s){console.warn("[CommunityHub] ProfileModule re-init:",s)}}if(window.CommunityModule){window.CommunityModule.state.isInitialized=!1;try{window.CommunityModule.init()}catch(s){console.warn("[CommunityHub] CommunityModule re-init:",s)}}if(window.Rituals&&(window.Rituals.state.hasSeenOpening=!1),window.CollectiveFieldDB&&await window.CollectiveFieldDB.init(),window._pendingHubScrollTarget){const s=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,requestAnimationFrame(()=>requestAnimationFrame(()=>{const d=document.getElementById(s);d&&d.scrollIntoView({behavior:"smooth",block:"start"})}))}}catch(a){console.error("❌ Failed to load Community Hub:",a);const s=document.getElementById("community-hub-main-content");s&&(s.innerHTML=`
          <div class="card" style="text-align:center; padding:var(--spacing-xl)">
            <h3 style="color:var(--neuro-text)">Failed to Load</h3>
            <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
            <p style="color:var(--neuro-text-lighter); font-size:0.9rem; margin-top:1rem">${a.message}</p>
          </div>`)}}destroy(){this._activeMembersWidget&&(this._activeMembersWidget.destroy(),this._activeMembersWidget=null),this._hubVisibilityHandler&&(document.removeEventListener("visibilitychange",this._hubVisibilityHandler),this._hubVisibilityHandler=null)}}const at=Object.freeze(Object.defineProperty({__proto__:null,default:Ve},Symbol.toStringTag,{value:"Module"})),we=[{id:"early_supporter",icon:"🌟",name:"Early Supporter",rarity:"epic",xp:100,desc:"Joined during early access"},{id:"vip_member",icon:"👑",name:"VIP Member",rarity:"legendary",xp:150,desc:"VIP community member"},{id:"beta_tester",icon:"🧪",name:"Beta Tester",rarity:"rare",xp:100,desc:"Helped test new features"},{id:"spiritual_guide",icon:"🕉️",name:"Spiritual Guide",rarity:"epic",xp:150,desc:"Community mentor and guide"},{id:"community_hero",icon:"🦸",name:"Community Hero",rarity:"legendary",xp:200,desc:"Outstanding community contribution"},{id:"first_step",icon:"🌱",name:"First Step",rarity:"common",xp:25,desc:"Took their first step in the community"},{id:"triple_threat",icon:"🎪",name:"Triple Threat",rarity:"uncommon",xp:50,desc:"Active in three different rooms"},{id:"moon_walker",icon:"🌙",name:"Moon Walker",rarity:"rare",xp:75,desc:"Night-time community explorer"},{id:"sun_keeper",icon:"☀️",name:"Sun Keeper",rarity:"uncommon",xp:50,desc:"Consistent morning presence"},{id:"energy_master",icon:"⚡",name:"Energy Master",rarity:"epic",xp:125,desc:"Master of community energy"},{id:"wave_rider",icon:"🌊",name:"Wave Rider",rarity:"rare",xp:75,desc:"Goes with the flow"},{id:"community_heart",icon:"💜",name:"Community Heart",rarity:"uncommon",xp:50,desc:"Heart of the community"},{id:"deep_diver",icon:"🔱",name:"Deep Diver",rarity:"epic",xp:125,desc:"Explores the depths of every topic"}];window.BADGE_REGISTRY=we;const Ye=["🏅","🎖️","🌟","👑","🧪","🕉️","🦸","🌱","🎪","🌙","☀️","⚡","🌊","💜","🔱","🔥","💎","🦋","🌸","🍀","🌈","⭐","🎯","🏆","🎗️","🌀","🔮","💫","🧘","🦅","🐉","🌺","🎵","💡","🌿","🦁","🐬","🌍","🎭","🛡️","⚔️","🗝️","🧬","🌠","🎋"];function A(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const Ae={_open:!1,_pollInterval:null,_bulkMembers:[],_bulkSelected:new Set,_bulkRendered:new Set,_filterTimer:null,_SECTIONS:["notifications","members","engagement","safety","leaderboard","rooms","retention","bulk"],_BULK_TABS:[["xp","🎁 XP"],["karma","🌀 Karma"],["badge","🏅 Badge"],["customBadge","✨ Custom Badge"],["unlock","🔓 Unlock"],["message","💬 Message"]],_UNLOCKS:[["tarot_vision_ai","Tarot Vision AI"],["shadow_alchemy_lab","Shadow Alchemy Lab"],["advanced_meditations","Advanced Meditations"],["self_analysis_pro","Self-Analysis Pro"],["luxury_blush_champagne_skin","Blush Champagne Skin"],["luxury_champagne_gold_skin","Champagne Gold Skin"],["luxury_marble_bronze_skin","Marble Bronze Skin"],["royal_indigo_skin","Royal Indigo Skin"],["earth_luxury_skin","Earth Luxury Skin"]],_NOTIF_ICONS:{report:"⚠️",help:"🆘",technical:"🔧"},_buildEmojiPicker(e,t){return`
            <div id="${t}"
                 style="display:none;flex-wrap:wrap;gap:4px;padding:8px;border-radius:10px;
                        border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);
                        max-height:130px;overflow-y:auto;margin-bottom:10px;">
                ${Ye.map(i=>`<button type="button"
                             onclick="AdminDashboard._pickEmoji('${e}','${t}','${i}')"
                             style="font-size:1.25rem;background:none;border:none;cursor:pointer;
                                    padding:3px 5px;border-radius:6px;line-height:1;transition:background 0.1s;"
                             onmouseover="this.style.background='rgba(0,0,0,0.07)'"
                             onmouseout="this.style.background='none'">${i}</button>`).join("")}
            </div>`},_pickEmoji(e,t,i){const o=document.getElementById(e);o&&(o.value=i);const n=document.getElementById(t);n&&(n.style.display="none")},_toggleEmojiPicker(e){const t=document.getElementById(e);t&&(t.style.display=t.style.display==="none"?"flex":"none")},async _pushNotify(e,t,i){try{await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e,payload:{title:t,body:i,icon:"/icons/icon-192x192.png",data:{url:"/"}}})})}catch(o){console.error("[AdminDashboard] push notify error:",o)}},_injectStyles(){if(document.getElementById("adminDashStyles"))return;const e=document.createElement("style");e.id="adminDashStyles",e.textContent=`
            @keyframes adminPulse {
                0%,100% { transform:scale(1); }
                50%      { transform:scale(1.2); }
            }
            .admin-section-header {
                display:flex; align-items:center; justify-content:space-between;
                padding:12px 16px; cursor:pointer; border-radius:12px; user-select:none;
                background:var(--neuro-accent-a08); border:1px solid var(--neuro-accent-a20);
                margin-bottom:2px; transition:background 0.15s;
            }
            .admin-section-header:hover { background:var(--neuro-accent-a10); }
            .admin-section-body   { padding:12px 4px 4px; }
            .admin-stat-grid {
                display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px;
            }
            .admin-stat-card {
                background:var(--neuro-accent-a08); border-radius:12px;
                padding:14px 12px; text-align:center; border:1px solid var(--neuro-accent-a10);
            }
            .admin-stat-value { font-size:1.6rem; font-weight:700; color:var(--neuro-accent); }
            .admin-stat-label { font-size:0.72rem; color:var(--text-muted,#888); margin-top:2px; text-transform:uppercase; letter-spacing:0.5px; }
            .admin-notif-row {
                display:flex; gap:10px; align-items:flex-start;
                padding:10px 12px; border-radius:10px; margin-bottom:6px;
                background:rgba(255,255,255,0.5); border:1px solid rgba(0,0,0,0.06);
            }
            .admin-notif-row.unread { border-left:3px solid var(--neuro-accent); }
            .admin-table           { width:100%; border-collapse:collapse; font-size:0.83rem; }
            .admin-table th        { text-align:left; padding:6px 8px; color:var(--text-muted,#888); font-weight:600; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px; }
            .admin-table td        { padding:8px; border-top:1px solid rgba(0,0,0,0.06); }
            .admin-refl-row        { padding:10px 12px; border-radius:10px; margin-bottom:6px; background:rgba(255,255,255,0.5); border:1px solid rgba(0,0,0,0.06); }

            @media (max-width:767px) {
                .admin-stat-grid        { grid-template-columns:repeat(2,1fr) !important; gap:7px; }
                .admin-stat-card        { padding:9px 8px; border-radius:10px; }
                .admin-stat-value       { font-size:1.05rem; }
                .admin-stat-label       { font-size:0.63rem; }
                .admin-section-header   { padding:8px 10px; }
                .admin-section-body     { padding:6px 2px 2px; }
                .admin-notif-row        { padding:7px 8px; gap:7px; }
                .admin-table            { font-size:0.72rem; }
                .admin-table th         { font-size:0.62rem; padding:4px 5px; }
                .admin-table td         { padding:5px 6px; }
                .admin-refl-row         { padding:7px 8px; }
                #adminDashOverlay > div:first-child                                    { padding:10px 14px !important; }
                #adminDashOverlay > div:first-child span[style*="font-size:1.4rem"]    { font-size:1rem !important; }
                #adminDashOverlay > div:first-child div[style*="font-size:1rem"]       { font-size:0.85rem !important; }
                #adminDashOverlay > div:last-child                                     { padding:14px 12px 48px !important; }
            }
        `,document.head.appendChild(e)},injectAdminUI(){var e,t,i;(i=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)!=null&&i.is_admin&&this.injectBadge()},injectBadge(){var o,n,r;if(document.getElementById("adminDashBadge")||!((r=(n=(o=window.Core)==null?void 0:o.state)==null?void 0:n.currentUser)!=null&&r.is_admin))return;this._injectStyles();const e=document.createElement("div");e.id="adminDashBadge",e.style.cssText="padding:0 0 32px;",e.innerHTML=`
            <section class="section">
                <div class="section-header">
                    <div class="section-title" style="display:flex;align-items:center;gap:0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin Tools
                    </div>
                    <div style="font-size:12px;color:var(--text-muted);">
                        <span id="adminDashUnreadBadge"
                              style="display:none;background:#ef4444;color:#fff;border-radius:99px;
                                     font-size:10px;font-weight:700;padding:2px 8px;margin-right:6px;
                                     animation:adminPulse 1.5s infinite;">0 new</span>
                    </div>
                </div>
                <div class="card" style="padding:16px;">
                    <picture>
                      <source srcset="/Community/AdminDashboard.webp" type="image/webp">
                      <img src="/Community/AdminDashboard.png"
                           onclick="AdminDashboard.openDashboard()"
                           alt="Open Admin Dashboard"
                           width="48" height="48" loading="lazy" decoding="async"
                           style="width:100%;border-radius:14px;cursor:pointer;display:block;
                                  transition:opacity 0.15s,transform 0.15s;box-shadow:0 4px 16px rgba(0,0,0,0.1);"
                           onmouseover="this.style.opacity='0.9';this.style.transform='scale(1.01)'"
                           onmouseout="this.style.opacity='1';this.style.transform='scale(1)'">
                    </picture>
                </div>
            </section>`;const t=document.getElementById("upcomingEventsContainer"),i=document.querySelector(".sanctuary-content");(t??i??document.body).insertAdjacentElement(t?"afterend":"beforeend",e),this._startBadgePoll()},async _updateBadge(){const e=await CommunityDB.getUnreadNotificationCount(),t=document.getElementById("adminDashUnreadBadge");t&&(t.textContent=e>99?"99+":e,t.style.display=e>0?"block":"none")},_startBadgePoll(){this._updateBadge(),this._pollInterval=setInterval(()=>this._updateBadge(),6e4)},openDashboard(){if(document.getElementById("adminDashOverlay"))return;this._open=!0;const e=document.createElement("div");e.id="adminDashOverlay",e.style.cssText="position:fixed;inset:0;z-index:99999;background:var(--neuro-bg,#f0f0f3);overflow-y:auto;font-family:var(--font-body,sans-serif);",e.innerHTML=`
            <div style="position:sticky;top:0;z-index:10;
                        background:var(--neuro-accent);backdrop-filter:blur(12px);
                        padding:16px 20px;display:flex;align-items:center;justify-content:space-between;
                        box-shadow:0 2px 20px var(--neuro-accent-a30);">
                <div style="display:flex;align-items:center;gap:10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <div>
                        <div style="font-size:1rem;font-weight:700;color:#fff;letter-spacing:0.5px;">Admin Dashboard</div>
                        <div id="adminDashSubtitle" style="font-size:0.72rem;color:rgba(255,255,255,0.7);">Loading...</div>
                    </div>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <button onclick="AdminDashboard.refreshAll()"
                            style="padding:6px 14px;border-radius:99px;border:1px solid rgba(255,255,255,0.3);
                                   background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;font-size:0.82rem;">
                        ↻ Refresh
                    </button>
                    <button onclick="AdminDashboard.closeDashboard()"
                            style="width:32px;height:32px;border-radius:50%;border:none;
                                   background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:1.1rem;">
                        ✕
                    </button>
                </div>
            </div>
            <div style="max-width:900px;margin:0 auto;padding:20px 16px 60px;">
                ${this._SECTIONS.map((t,i)=>this._sectionShell(t,this._sectionTitle(t),i===0)).join("")}
            </div>`,document.body.appendChild(e),document.body.style.overflow="hidden",requestAnimationFrame(()=>this.refreshAll())},closeDashboard(){var e;(e=document.getElementById("adminDashOverlay"))==null||e.remove(),document.body.style.overflow="",this._open=!1,this._bulkRendered.clear(),this._updateBadge()},_sectionTitle(e){return{notifications:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Notifications',members:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Members',engagement:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Community Engagement',safety:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Safety & Stats',leaderboard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> Leaderboard',rooms:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg> Room Usage Today',retention:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Retention Signals',bulk:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Bulk Actions'}[e]||e},_sectionShell(e,t,i=!1){return`
        <div style="margin-bottom:12px;">
            <div class="admin-section-header" onclick="AdminDashboard.toggleSection('${e}')">
                <span style="font-size:0.92rem;font-weight:700;color:var(--neuro-text,#333);">${t}</span>
                <span id="adminSecToggle_${e}" style="font-size:0.8rem;color:var(--neuro-accent);">${i?"▼":"▶"}</span>
            </div>
            <div id="adminSec_${e}" class="admin-section-body" style="display:${i?"block":"none"};">
                <div id="adminSecContent_${e}" style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>
            </div>
        </div>`},toggleSection(e){const t=document.getElementById(`adminSec_${e}`),i=document.getElementById(`adminSecToggle_${e}`);if(!t)return;const o=t.style.display!=="none";t.style.display=o?"none":"block",i.textContent=o?"▶":"▼",o||this._loadSection(e)},refreshAll(){const e=document.getElementById("adminDashSubtitle");e&&(e.textContent=`Last updated: ${new Date().toLocaleTimeString()}`);for(const t of this._SECTIONS){const i=document.getElementById(`adminSec_${t}`);i&&(i.style.display!=="none"||t==="notifications")&&this._loadSection(t)}},async _loadSection(e){const t=document.getElementById(`adminSecContent_${e}`);if(t){t.innerHTML='<div style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>';try{await this[`_render${e.charAt(0).toUpperCase()+e.slice(1)}`](t)}catch(i){t.innerHTML=`<div style="color:#ef4444;font-size:0.83rem;padding:8px;">Failed to load: ${A(i.message)}</div>`}}},async _renderNotifications(e){const t=await CommunityDB.getAdminNotifications(30);if(!t.length){e.innerHTML='<div style="color:var(--text-muted,#888);padding:8px;font-size:0.83rem;">No notifications yet.</div>';return}const i=t.filter(o=>!o.read).length;e.innerHTML=`
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:0.82rem;color:var(--text-muted,#888);">${i} unread of ${t.length}</span>
                <button onclick="AdminDashboard._markAllRead()"
                        style="padding:4px 12px;border-radius:99px;border:1px solid var(--neuro-accent-a30);
                               background:var(--neuro-accent-a08);color:var(--neuro-accent);
                               font-size:0.78rem;cursor:pointer;">Mark all read</button>
            </div>
            ${t.map(o=>{var n,r,l,a,s,d,u;return`
                <div class="admin-notif-row ${o.read?"":"unread"}" id="adminNotif_${o.id}">
                    <span style="font-size:1.2rem;flex-shrink:0;">${this._NOTIF_ICONS[o.type]||"📋"}</span>
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                            <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize;">${o.type}</span>
                            <span style="font-size:0.72rem;color:var(--text-muted,#888);">${this._timeAgo(o.created_at)}</span>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text-muted,#888);">
                            From: <strong>${A(((n=o.payload)==null?void 0:n.sender_name)||"Unknown")}</strong>
                            ${(r=o.payload)!=null&&r.room?`· ${A(o.payload.room)}`:""}
                        </div>
                        ${(l=o.payload)!=null&&l.message?`<div style="font-size:0.82rem;margin-top:4px;font-style:italic;">"${A(o.payload.message)}"</div>`:""}
                        ${(a=o.payload)!=null&&a.reason?`<div style="font-size:0.82rem;margin-top:4px;">Reason: ${A(o.payload.reason)}</div>`:""}
                        ${(s=o.payload)!=null&&s.details?`<div style="font-size:0.82rem;color:var(--text-muted,#888);">${A(o.payload.details)}</div>`:""}
                        ${(d=o.payload)!=null&&d.issueType?`<div style="font-size:0.82rem;margin-top:4px;">Type: ${A(o.payload.issueType)}</div>`:""}
                        ${(u=o.payload)!=null&&u.description?`<div style="font-size:0.82rem;color:var(--text-muted,#888);">${A(o.payload.description)}</div>`:""}
                    </div>
                    ${o.read?"":`
                    <button onclick="AdminDashboard._markRead(${o.id})"
                            style="flex-shrink:0;padding:3px 8px;border-radius:6px;border:none;cursor:pointer;
                                   font-size:0.72rem;background:var(--neuro-accent-a10);color:var(--neuro-accent);">
                        ✓ Read
                    </button>`}
                </div>`}).join("")}`},async _renderMembers(e){const[t,i,{data:o=[]}]=await Promise.all([CommunityDB.getAdminMemberStats(),CommunityDB.getActiveMembers(),CommunityDB._sb.from("profiles").select("id, name, emoji, avatar_url, community_status").order("name")]),n=Object.fromEntries(i.map(s=>[s.user_id,s])),r=new Set(i.map(s=>s.user_id)),l=o.filter(s=>!r.has(s.id)),a=(s,d)=>{const u=(d==null?void 0:d.status)||"offline",m=(d==null?void 0:d.activity)||"💤 Offline",g=u==="online"?"#22c55e":u==="away"?"#f59e0b":"#aaa",h=s.avatar_url?`<img src="${A(s.avatar_url)}" alt="Member avatar" width="40" height="40" style="width:100%;height:100%;object-fit:cover;" loading="lazy" decoding="async">`:A(s.emoji||(s.name||"?").charAt(0));return`
                <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);cursor:pointer;"
                     onclick="MemberProfileModal?.open('${s.id}')">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:${window.Core.getAvatarGradient(s.id)};
                                display:flex;align-items:center;justify-content:center;
                                font-size:0.9rem;color:#fff;flex-shrink:0;overflow:hidden;">
                        ${h}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:0.85rem;font-weight:600;">${A(s.name||"Member")}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted,#888);">${A(m)}</div>
                    </div>
                    <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${g};"></span>
                </div>`};e.innerHTML=`
            <div class="admin-stat-grid" style="margin-bottom:16px;">
                ${this._statCard(t.total||0,"Total Members")}
                ${this._statCard(t.onlineNow||0,"Online Now")}
                ${this._statCard(t.newThisWeek||0,"New This Week")}
                ${this._statCard(l.length,"Offline")}
            </div>
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin-bottom:8px;">🟢 Online & Away</div>
            ${i.length?i.map(s=>a(s.profiles||{id:s.user_id,name:"Member"},s)).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;margin-bottom:12px;">No members online.</div>'}
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin:12px 0 8px;">⚫ Offline (${l.length})</div>
            ${l.map(s=>a(s,n[s.id]||null)).join("")}`},async _renderEngagement(e){const t=await CommunityDB.getAdminEngagementStats();e.innerHTML=`
            <div class="admin-stat-grid">
                ${this._statCard(t.reflectionsToday||0,"Reflections Today")}
                ${this._statCard(t.reflectionsTotal||0,"Reflections Total")}
                ${this._statCard(t.whispersToday||0,"Whispers Today")}
                ${this._statCard(t.appreciationsToday||0,"Appreciations Today")}
            </div>`},async _renderSafety(e){const[t,i]=await Promise.all([CommunityDB.getSafetyStats(),CommunityDB.getPushSubscriptionCount()]);e.innerHTML=`
            <div class="admin-stat-grid">
                ${this._statCard(t.unreadNotifs||0,"Unread Notifications")}
                ${this._statCard(t.reportsThisWeek||0,"Reports This Week")}
                ${this._statCard(t.blockedTotal||0,"Blocked Relationships")}
                ${this._statCard(i||0,"Push Subscriptions")}
            </div>`},async _renderLeaderboard(e){const t=await CommunityDB.getLeaderboard(),i=(o,n)=>o.length?o.map((r,l)=>{var a,s,d;return`
                <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);">
                    <span style="font-size:1rem;">${["🥇","🥈","🥉"][l]||"·"}</span>
                    <span style="font-size:0.9rem;">${((a=r.profiles)==null?void 0:a.emoji)||""}</span>
                    <span style="flex:1;font-size:0.85rem;font-weight:600;">${A(((s=r.profiles)==null?void 0:s.name)||"Member")}</span>
                    <span style="font-size:0.85rem;font-weight:700;color:var(--neuro-accent);">${((d=r.payload)==null?void 0:d[n])||0}</span>
                </div>`}).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;">No data yet.</div>';e.innerHTML=`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">⭐ Top XP</div>
                    ${i(t.xp,"xp")}
                </div>
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">🌀 Top Karma</div>
                    ${i(t.karma,"karma")}
                </div>
            </div>`},async _renderRooms(e){const t=await CommunityDB.getRoomUsageToday();if(!t.length){e.innerHTML='<div style="color:var(--text-muted,#888);font-size:0.83rem;">No room entries logged today yet.</div>';return}e.innerHTML=`
            <table class="admin-table">
                <thead><tr><th>Room</th><th>Entries</th><th>Avg Duration</th></tr></thead>
                <tbody>
                    ${t.map(i=>{const o=i.entries>0?Math.round(i.totalSeconds/i.entries):0;return`<tr>
                            <td style="font-weight:600;">${this._formatRoomId(i.room_id)}</td>
                            <td>${i.entries}</td>
                            <td>${this._formatDuration(o)}</td>
                        </tr>`}).join("")}
                </tbody>
            </table>`},async _renderRetention(e){var i,o;const t=await CommunityDB.getRetentionSignals();e.innerHTML=`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">😶 Going Quiet</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;">Active last week, not this week</div>
                    ${(i=t.quietMembers)!=null&&i.length?t.quietMembers.map(n=>`
                            <div style="padding:6px 10px;border-radius:8px;margin-bottom:4px;
                                        background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);
                                        font-size:0.83rem;cursor:pointer;"
                                 onclick="MemberProfileModal?.open('${n}')">
                                ${n.substring(0,8)}...
                            </div>`).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;">None - great retention! 🎉</div>'}
                </div>
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">🔥 Consistent</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;">Active last 3 days</div>
                    ${(o=t.streakMembers)!=null&&o.length?t.streakMembers.map(n=>`
                            <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;
                                        margin-bottom:4px;background:rgba(34,197,94,0.06);
                                        border:1px solid rgba(34,197,94,0.15);cursor:pointer;"
                                 onclick="MemberProfileModal?.open('${n.user_id}')">
                                <span>${n.emoji||"🧘"}</span>
                                <span style="font-size:0.83rem;font-weight:600;">${A(n.name||"Member")}</span>
                            </div>`).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;">No data yet.</div>'}
                </div>
            </div>`},async _renderBulk(e){const{data:t=[]}=await CommunityDB._sb.from("profiles").select("id, name, emoji, avatar_url, community_role").order("name");this._bulkMembers=t,this._bulkSelected=new Set,this._bulkRendered.clear();const i=t.map(o=>`
            <label id="bulkRow_${o.id}"
                   style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background 0.1s;"
                   onmouseover="this.style.background='var(--neuro-accent-a08)'"
                   onmouseout="this.style.background='none'">
                <input type="checkbox" value="${o.id}"
                       onchange="AdminDashboard._bulkToggle('${o.id}',this.checked)"
                       style="width:16px;height:16px;cursor:pointer;accent-color:var(--neuro-accent);">
                <span style="font-size:1.1rem;">${o.emoji||"👤"}</span>
                <span style="font-size:0.85rem;font-weight:600;color:var(--neuro-text);">${A(o.name||"Member")}</span>
                <span style="font-size:0.75rem;color:var(--text-muted,#888);margin-left:auto;">${A(o.community_role||"Member")}</span>
            </label>`).join("");e.innerHTML=`
            <div style="margin-bottom:16px;">
                <div style="margin-bottom:12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);">Select Members</div>
                        <div style="display:flex;gap:8px;">
                            <button onclick="AdminDashboard._bulkSelectAll()"
                                    style="padding:4px 10px;border-radius:99px;border:1px solid var(--neuro-accent-a30);background:var(--neuro-accent-a08);color:var(--neuro-accent);font-size:0.75rem;font-weight:600;cursor:pointer;">All</button>
                            <button onclick="AdminDashboard._bulkSelectNone()"
                                    style="padding:4px 10px;border-radius:99px;border:1px solid rgba(0,0,0,0.1);background:none;color:var(--text-muted,#888);font-size:0.75rem;font-weight:600;cursor:pointer;">None</button>
                        </div>
                    </div>
                    <input id="bulkMemberSearch" type="text" placeholder="Search members..."
                           oninput="AdminDashboard._bulkFilterMembers(this.value)"
                           style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.85rem;box-sizing:border-box;margin-bottom:8px;">
                    <div id="bulkMemberList"
                         style="max-height:220px;overflow-y:auto;border-radius:12px;border:1px solid rgba(0,0,0,0.07);background:var(--surface,#fff);padding:6px;">
                        ${i}
                    </div>
                    <div id="bulkSelectedCount" style="font-size:0.78rem;color:var(--text-muted,#888);margin-top:6px;text-align:right;">0 members selected</div>
                </div>

                <div style="border-top:1px solid rgba(0,0,0,0.07);margin:16px 0;"></div>

                <!-- Tab bar -->
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;" id="bulkTabBar">
                    ${this._BULK_TABS.map(([o,n],r)=>`
                        <button onclick="AdminDashboard._bulkShowTab('${o}')" id="bulkTab_${o}"
                                style="padding:6px 14px;border-radius:99px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:all 0.15s;
                                       ${r===0?"background:var(--neuro-accent-a20);color:var(--neuro-accent);":"background:rgba(0,0,0,0.05);color:var(--text-muted,#888);"}">
                            ${n}
                        </button>`).join("")}
                </div>

                <!-- FIX: single active panel container — content injected lazily on tab switch -->
                <div id="bulkActivePanel"></div>
            </div>`,this._bulkRenderTabContent("xp")},_bulkRenderTabContent(e){if(this._bulkRendered.has(e))return;const t="width:100%;padding:8px 12px;border-radius:10px;margin-bottom:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;",i="width:100%;padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);",o="flex:1;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;",n="width:100%;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;box-sizing:border-box;margin-bottom:8px;",r="font-size:0.82rem;color:var(--text-muted,#888);margin-bottom:8px;",l={xp:`
                <div style="${r}">Send XP to all selected members</div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <input id="bulkXpAmount" type="number" min="1" value="100" placeholder="XP amount" style="${o}">
                    <button onclick="AdminDashboard._bulkSendXP()" style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send XP</button>
                </div>`,karma:`
                <div style="${r}">Send Karma to all selected members</div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <input id="bulkKarmaAmount" type="number" min="1" value="10" placeholder="Karma amount" style="${o}">
                    <button onclick="AdminDashboard._bulkSendKarma()" style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send Karma</button>
                </div>`,badge:`
                <div style="${r}">Send a badge to all selected members</div>
                <select id="bulkBadgeSelect" style="${t}">
                    ${we.map(s=>`<option value="${s.id}" data-icon="${s.icon}" data-rarity="${s.rarity}" data-xp="${s.xp}" data-desc="${s.desc}">${s.icon} ${s.name}</option>`).join("")}
                </select>
                <button onclick="AdminDashboard._bulkSendBadge()" style="${i}">Send Badge</button>`,customBadge:`
                <div style="${r}">Create and send a custom badge to all selected members</div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <input type="text" id="bulkCustomIcon" maxlength="4" value="🏅" readonly
                           style="width:52px;padding:8px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);
                                  background:var(--surface,#fff);color:var(--neuro-text);
                                  font-size:1.5rem;text-align:center;box-sizing:border-box;">
                    <button type="button"
                            onclick="AdminDashboard._toggleEmojiPicker('bulkCustomEmojiPicker')"
                            style="flex:1;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);
                                   background:var(--surface,#fff);color:var(--neuro-accent);
                                   font-size:0.82rem;font-weight:600;cursor:pointer;">
                        Choose Emoji ▾
                    </button>
                </div>
                ${this._buildEmojiPicker("bulkCustomIcon","bulkCustomEmojiPicker")}
                <input type="text" id="bulkCustomName" maxlength="40" placeholder="Badge name" style="${n}">
                <textarea id="bulkCustomDesc" placeholder="Description (optional)" maxlength="120" rows="2"
                          style="${n}resize:none;"></textarea>
                <select id="bulkCustomRarity" style="${t}">
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic" selected>Epic</option>
                    <option value="legendary">Legendary</option>
                </select>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px;">
                    <input type="number" id="bulkCustomXp"    min="0" value="100" placeholder="XP reward"
                           style="padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;box-sizing:border-box;">
                    <input type="number" id="bulkCustomKarma" min="0" value="15"  placeholder="Karma reward"
                           style="padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;box-sizing:border-box;">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;font-size:0.72rem;color:var(--text-muted,#888);text-align:center;margin-bottom:10px;">
                    <span>XP reward</span><span>Karma reward</span>
                </div>
                <button onclick="AdminDashboard._bulkSendCustomBadge()" style="${i}">Send Custom Badge</button>`,unlock:`
                <div style="${r}">Unlock a feature for all selected members</div>
                <select id="bulkUnlockSelect" style="${t}">
                    ${this._UNLOCKS.map(([s,d])=>`<option value="${s}">${d}</option>`).join("")}
                </select>
                <button onclick="AdminDashboard._bulkSendUnlock()" style="${i}">Unlock Feature</button>`,message:`
                <div style="${r}">Broadcast a message - appears in recipients' Whispers inbox</div>
                <textarea id="bulkMessageText" placeholder="Write your message..." rows="4"
                          style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;resize:vertical;box-sizing:border-box;margin-bottom:10px;"></textarea>
                <button onclick="AdminDashboard._bulkSendMessage()" style="${i}">Send Message</button>`},a=document.getElementById("bulkActivePanel");a&&l[e]&&(a.innerHTML=l[e],this._bulkRendered.add(e))},_bulkToggle(e,t){this._bulkSelected[t?"add":"delete"](e),this._bulkUpdateCount()},_bulkSelectAll(){for(const e of this._bulkMembers){this._bulkSelected.add(e.id);const t=document.querySelector(`#bulkRow_${e.id} input[type=checkbox]`);t&&(t.checked=!0)}this._bulkUpdateCount()},_bulkSelectNone(){this._bulkSelected.clear(),document.querySelectorAll("#bulkMemberList input[type=checkbox]").forEach(e=>e.checked=!1),this._bulkUpdateCount()},_bulkUpdateCount(){const e=this._bulkSelected.size,t=document.getElementById("bulkSelectedCount");t&&(t.textContent=`${e} member${e!==1?"s":""} selected`)},_bulkFilterMembers(e){clearTimeout(this._filterTimer),this._filterTimer=setTimeout(()=>{const t=e.toLowerCase(),i=document.querySelectorAll("#bulkMemberList label"),o=[];i.forEach(n=>{var l,a;const r=((a=(l=n.querySelector("span:nth-child(3)"))==null?void 0:l.textContent)==null?void 0:a.toLowerCase())||"";o.push({row:n,show:r.includes(t)})}),o.forEach(({row:n,show:r})=>{n.style.display=r?"":"none"})},120)},_bulkShowTab(e){for(const[t]of this._BULK_TABS){const i=document.getElementById(`bulkTab_${t}`);if(!i)continue;const o=t===e;i.style.background=o?"var(--neuro-accent-a20)":"rgba(0,0,0,0.05)",i.style.color=o?"var(--neuro-accent)":"var(--text-muted,#888)"}this._bulkRendered.delete(e),this._bulkRenderTabContent(e)},_bulkGuard(){return this._bulkSelected.size===0?(window.Core.showToast("Select at least one member first"),!1):!0},async _bulkSendGamification({inputId:e,label:t,xpDelta:i=0,karmaDelta:o=0,notifTitle:n,notifBody:r}){var d;if(!this._bulkGuard())return;const l=parseInt((d=document.getElementById(e))==null?void 0:d.value,10);if(!l||l<1){window.Core.showToast(`Enter a valid ${t} amount`);return}const a=[...this._bulkSelected];window.Core.showToast(`Sending ${l} ${t} to ${a.length} members...`);let s=0;for(const u of a)try{await CommunityDB.adminUpdateGamification(u,{xpDelta:i==="amount"?l:i,karmaDelta:o==="amount"?l:o})?(s++,await this._pushNotify(u,n,r(l))):console.warn("[AdminDashboard] _bulkSendGamification: no success for",u)}catch(m){console.error("[AdminDashboard] _bulkSendGamification error for",u,m)}window.Core.showToast(`Sent ${l} ${t} to ${s}/${a.length} members`)},async _bulkSendXP(){await this._bulkSendGamification({inputId:"bulkXpAmount",label:"XP",xpDelta:"amount",notifTitle:"🎁 Gift from Aanandoham!",notifBody:e=>`You received +${e} XP!`})},async _bulkSendKarma(){await this._bulkSendGamification({inputId:"bulkKarmaAmount",label:"Karma",karmaDelta:"amount",notifTitle:"🎁 Gift from Aanandoham!",notifBody:e=>`You received +${e} Karma!`})},async _bulkSendBadge(){if(!this._bulkGuard())return;const e=document.getElementById("bulkBadgeSelect"),t=e==null?void 0:e.value;if(!t){window.Core.showToast("Select a badge");return}const i=we.find(u=>u.id===t)||{},o=i.name||t,n=i.icon||"🏅",r=i.rarity||"common",l=i.xp??0,a=i.desc||"",s=[...this._bulkSelected];window.Core.showToast(`Sending badge to ${s.length} members...`);let d=0;for(const u of s)try{await CommunityDB.adminUpdateGamification(u,{badgeId:t,badgeName:o,badgeIcon:n,badgeRarity:r,badgeXp:l,badgeDesc:a})?(d++,await this._pushNotify(u,"🏅 New Badge!",`You earned the ${n} ${o} badge!`)):console.warn("[AdminDashboard] _bulkSendBadge: no success for",u)}catch(m){console.error("[AdminDashboard] _bulkSendBadge error for",u,m)}window.Core.showToast(`Sent badge to ${d}/${s.length} members`)},async _bulkSendCustomBadge(){var d,u,m,g,h,v;if(!this._bulkGuard())return;const e=((d=document.getElementById("bulkCustomIcon"))==null?void 0:d.value.trim())||"🏅",t=(u=document.getElementById("bulkCustomName"))==null?void 0:u.value.trim(),i=((m=document.getElementById("bulkCustomDesc"))==null?void 0:m.value.trim())||"",o=((g=document.getElementById("bulkCustomRarity"))==null?void 0:g.value)||"epic",n=parseInt((h=document.getElementById("bulkCustomXp"))==null?void 0:h.value,10)||0,r=parseInt((v=document.getElementById("bulkCustomKarma"))==null?void 0:v.value,10)||0;if(!t){window.Core.showToast("Please enter a badge name");return}const l="custom_"+t.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")+"_"+Date.now(),a=[...this._bulkSelected];window.Core.showToast(`Sending custom badge to ${a.length} members...`);let s=0;for(const b of a)try{await CommunityDB.adminUpdateGamification(b,{badgeId:l,badgeName:t,badgeIcon:e,badgeRarity:o,badgeXp:n,badgeDesc:i})?(r>0&&await CommunityDB.adminUpdateGamification(b,{karmaDelta:r}),s++,await this._pushNotify(b,"🎖️ Special Badge!",`You received the ${e} ${t} badge!`)):console.warn("[AdminDashboard] _bulkSendCustomBadge: no success for",b)}catch(x){console.error("[AdminDashboard] _bulkSendCustomBadge error for",b,x)}window.Core.showToast(`Sent custom badge to ${s}/${a.length} members`)},async _bulkSendUnlock(){var r;if(!this._bulkGuard())return;const e=document.getElementById("bulkUnlockSelect"),t=e==null?void 0:e.value,i=((r=e==null?void 0:e.options[e.selectedIndex])==null?void 0:r.text)||t;if(!t){window.Core.showToast("Select a feature");return}const o=[...this._bulkSelected];window.Core.showToast(`Unlocking ${i} for ${o.length} members...`);let n=0;for(const l of o)try{await CommunityDB.adminUpdateGamification(l,{unlockFeature:t})?(n++,await this._pushNotify(l,"🔓 Feature Unlocked!",`${i} has been unlocked for you!`)):console.warn("[AdminDashboard] _bulkSendUnlock: no success for",l)}catch(a){console.error("[AdminDashboard] _bulkSendUnlock error for",l,a)}window.Core.showToast(`Unlocked ${i} for ${n}/${o.length} members`)},async _bulkSendMessage(){var o,n;if(!this._bulkGuard())return;const e=(n=(o=document.getElementById("bulkMessageText"))==null?void 0:o.value)==null?void 0:n.trim();if(!e){window.Core.showToast("Write a message first");return}const t=[...this._bulkSelected];window.Core.showToast(`Broadcasting to ${t.length} members...`);let i={sent:0};try{i=await CommunityDB.broadcastMessage(t,e)}catch(r){console.error("[AdminDashboard] _bulkSendMessage error:",r),window.Core.showToast("Failed to send messages");return}if(i.sent>0){for(const r of t)await this._pushNotify(r,"💬 Message from Aanandoham",e.substring(0,80));document.getElementById("bulkMessageText").value="",window.Core.showToast(`Message sent to ${i.sent}/${t.length} members`)}else window.Core.showToast("Failed to send messages")},async _markRead(e){var i;await CommunityDB.markNotificationRead(e);const t=document.getElementById(`adminNotif_${e}`);t&&(t.classList.remove("unread"),(i=t.querySelector("button"))==null||i.remove()),this._updateBadge()},async _markAllRead(){await CommunityDB.markAllNotificationsRead(),this._loadSection("notifications"),this._updateBadge()},async _deleteReflection(e,t){var o;if(!confirm("Delete this reflection?"))return;t.disabled=!0,await CommunityDB.deleteReflection(e)?((o=t.closest(".admin-refl-row"))==null||o.remove(),window.Core.showToast("Reflection deleted")):(window.Core.showToast("Could not delete"),t.disabled=!1)},_statCard(e,t){return`
            <div class="admin-stat-card">
                <div class="admin-stat-value">${e}</div>
                <div class="admin-stat-label">${t}</div>
            </div>`},_timeAgo(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),i=Math.floor(t/6e4),o=Math.floor(t/36e5),n=Math.floor(t/864e5);return i<1?"just now":i<60?`${i}m ago`:o<24?`${o}h ago`:`${n}d ago`},_formatDuration(e){return e?e<60?`${e}s`:e<3600?`${Math.round(e/60)}m`:`${(e/3600).toFixed(1)}h`:"-"},_formatRoomId(e){return(e||"").replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase())},_esc:A};window.AdminDashboard=Ae;const Xe=Object.freeze(Object.defineProperty({__proto__:null,AdminDashboard:Ae},Symbol.toStringTag,{value:"Module"})),Be={state:{hasSeenOpening:!1,isInitialized:!1,autoCloseTimer:null},config:{OPENING_AUTO_CLOSE_MS:5e3,CLOSING_AUTO_CLOSE_MS:3e3,OPENING_COOLDOWN_MS:1440*60*1e3,OPENING_TEXTS:["Enter with intention, leave with gratitude","This space holds you. Enter with presence.","Breathe in. You are welcome here.","Leave the noise behind. Step into stillness.","You are exactly where you need to be.","Enter gently. This moment is yours.","Set down what you carry. Enter with an open heart.","The space is ready. So are you.","Come as you are. This is a place of welcome.","Arrive fully. Begin with intention."],CLOSING_TEXTS:["Thank you for holding space with us","Carry the stillness with you as you go.","You showed up. That is enough.","May what was planted here continue to grow.","Go gently. You have done something meaningful.","The practice continues beyond this space.","Thank you for your presence in this circle.","Rest in what was received here today.","You are changed by having paused. Go well.","Until next time - carry the quiet with you."],ROOM_MODULES:["BreathworkRoom","SilentRoom","GuidedRoom","OshoRoom","DeepWorkRoom","CampfireRoom","TarotRoom","ReikiRoom","NewMoonRoom","WaxingMoonRoom","FullMoonRoom","WaningMoonRoom","SpringSolarRoom","SummerSolarRoom","AutumnSolarRoom","WinterSolarRoom"]},init(){if(this.state.isInitialized){console.warn("Rituals already initialized");return}try{this.loadState(),this.setupEventListeners(),this.state.isInitialized=!0}catch(e){console.error("Rituals initialization failed:",e)}},setupEventListeners(){document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const t=document.getElementById("openingOverlay"),i=document.getElementById("closingOverlay");t!=null&&t.classList.contains("active")?this.completeOpening():i!=null&&i.classList.contains("active")&&this.completeClosing()}),document.addEventListener("click",e=>{var i;const t=(i=e.target.closest("[data-action]"))==null?void 0:i.dataset.action;t==="ritual-opening"?this.completeOpening():t==="ritual-closing"&&this.completeClosing()})},loadState(){try{const e=localStorage.getItem("rituals_lastSeen");if(e){const t=Date.now()-parseInt(e,10);this.state.hasSeenOpening=t<this.config.OPENING_COOLDOWN_MS}}catch(e){console.error("Failed to load rituals state:",e)}},saveState(){try{localStorage.setItem("rituals_lastSeen",Date.now().toString())}catch(e){console.error("Failed to save rituals state:",e)}},completeOpening(){var t;const e=document.getElementById("openingOverlay");e&&(clearTimeout(this.state.autoCloseTimer),this.state.autoCloseTimer=null,e.classList.remove("active"),document.body.classList.remove("ritual-active"),this.state.hasSeenOpening=!0,this.saveState(),(t=k==null?void 0:k.showToast)==null||t.call(k,"Welcome to the space"))},showClosing(){const e=document.getElementById("closingOverlay"),t=document.getElementById("communityHubFullscreenContainer");if(!e){console.warn("Closing overlay not found");return}const i=document.getElementById("closingRitualText");i&&(i.textContent=`"${this._randomText("CLOSING_TEXTS")}"`),document.body.classList.add("ritual-active"),t&&(t.style.display="block",t.style.pointerEvents="auto"),e.classList.add("active"),e.setAttribute("aria-hidden","false");const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches?1e3:this.config.CLOSING_AUTO_CLOSE_MS;this.state.autoCloseTimer=setTimeout(()=>this.completeClosing(),n)},completeClosing(){var i,o;const e=document.getElementById("closingOverlay"),t=document.getElementById("communityHubFullscreenContainer");if(!e){console.warn("Closing overlay not found");return}e.classList.remove("active"),e.setAttribute("aria-hidden","true"),document.body.classList.remove("ritual-active"),document.body.style.overflow="",clearTimeout(this.state.autoCloseTimer),this.state.autoCloseTimer=null,t&&(t.style.display="none"),this.cleanupActiveRoom(),(i=k==null?void 0:k.navigateTo)==null||i.call(k,"hubView"),(o=k==null?void 0:k.showToast)==null||o.call(k,"Space closed with gratitude")},cleanupActiveRoom(){const e=this.findActiveRoom();if(!e)return;const{module:t,name:i}=e;typeof t.leaveRoom=="function"?t.leaveRoom():typeof t.cleanup=="function"&&t.cleanup()},findActiveRoom(){if(window.currentSolarRoom)return{name:"CurrentSolarRoom",module:window.currentSolarRoom};if(window.currentLunarRoom)return{name:"CurrentLunarRoom",module:window.currentLunarRoom};const e=document.getElementById("dynamicRoomContent"),t=(e==null?void 0:e.children.length)>0,i=!!document.querySelector(".ps-header");if(!t||!i)return null;for(const o of this.config.ROOM_MODULES){const n=window[o];if(!(n!=null&&n.roomId))continue;const{roomId:r}=n;if(document.getElementById(`${r}ParticipantStack`)||document.getElementById(`${r}View`)||document.getElementById(`${r}TimerDisplay`))return{name:o,module:n}}return null},getRoomViewId(e,t){return e.roomId?`${e.roomId}PracticeView`:e.viewId?e.viewId:`${t.toLowerCase().replace("room","")}PracticeView`},_randomText(e){const t=this.config[e];return t[Math.floor(Math.random()*t.length)]},reset(){this.state.hasSeenOpening=!1,localStorage.removeItem("rituals_lastSeen")},hasOverlay(e){return!!document.getElementById(`${e}Overlay`)}};window.Rituals=Be;const Ke=Object.freeze(Object.defineProperty({__proto__:null,Rituals:Be},Symbol.toStringTag,{value:"Module"})),Le={state:{isInitialized:!1,appreciatedReflections:new Set,reportingUserId:null},config:{MIN_REFLECTION_LENGTH:1,MAX_REFLECTION_LENGTH:500,MIN_REPORT_LENGTH:10,MIN_MODERATOR_MESSAGE_LENGTH:10,MIN_TECHNICAL_DESCRIPTION_LENGTH:10},async init(){if(!this.state.isInitialized)try{this.state.appreciatedReflections=await c.getMyAppreciations(),this.renderReflectionsHTML(),await this.renderReflections(),this.subscribeToNewReflections(),this._initWhisperBadge(),this.state.isInitialized=!0}catch(e){console.error("[CommunityModule] init failed:",e)}},_initWhisperBadge(){const e=()=>{var t;return(t=window.WhisperModal)==null?void 0:t.refreshUnreadBadge()};if(c!=null&&c.ready)e();else{const t=setInterval(()=>{c!=null&&c.ready&&(clearInterval(t),e())},300)}},renderReflectionsHTML(){const e=document.getElementById("communityReflectionsContainer");if(!e){console.warn("[CommunityModule] #communityReflectionsContainer not found");return}e.innerHTML=this._buildReflectionsShell(),this._setupCharCounter("reflectionInput","charCount")},_buildReflectionsShell(){var l,a;const e=((a=(l=window.Core)==null?void 0:l.state)==null?void 0:a.currentUser)||{},t=e.name||"You",i=e.avatar_url||"",o=window.Core.getAvatarGradient(e.id||"me"),n=i?`<img src="${i}" alt="${t}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" loading="lazy" decoding="async">`:e.emoji||t.charAt(0).toUpperCase();return`
        <section class="section">
            <div class="section-header">
                <div class="section-title">Community Reflections</div>
            </div>

            <div class="reflection" style="margin-bottom:16px;">
                <div class="ref-header">
                    <div class="ref-avatar" style="${i?"background:transparent;":`background:${o};`}cursor:pointer;"
                         role="button" tabindex="0"
                         aria-label="View profile"
                         onclick="CommunityModule.viewMember('${e.id}')"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();CommunityModule.viewMember('${e.id}');}">
                        ${n}
                    </div>
                    <div class="ref-meta" style="flex:1;">
                        <div class="ref-author">${this._esc(t)}</div>
                        <div class="ref-time">Write a reflection...</div>
                    </div>
                </div>
                <textarea id="reflectionInput"
                          aria-label="Write a reflection"
                          placeholder="Share a reflection with the community..."
                          maxlength="${this.config.MAX_REFLECTION_LENGTH}"
                          style="width:100%;padding:10px 12px;border:1px solid var(--border);
                                 border-radius:var(--radius-md);background:var(--neuro-bg);
                                 color:var(--text);resize:none;min-height:80px;
                                 font-size:14px;line-height:1.6;box-sizing:border-box;margin-top:4px;"></textarea>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:10px;border-top:2px solid var(--border);">
                    <span style="font-size:11px;color:var(--text-muted);"><span id="charCount">0</span>/${this.config.MAX_REFLECTION_LENGTH}</span>
                    <button type="button" onclick="CommunityModule.shareReflection()"
                            class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;padding:7px 20px;font-size:13px;">
                        Share
                    </button>
                </div>
            </div>

            <div id="reflectionsContainer"></div>
        </section>`},async renderReflections(){const e=document.getElementById("reflectionsContainer");if(e){e.innerHTML='<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Loading reflections...</div>';try{const[t,i]=await Promise.all([c.getReflections(20),c.getBlockedUsers()]),o=t.filter(n=>{var r;return!i.has((r=n.profiles)==null?void 0:r.id)});e.innerHTML=o.length?o.map(n=>this._buildReflectionHTML(n)).join(""):'<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Be the first to share a reflection ✨</div>'}catch(t){console.error("[CommunityModule] renderReflections error:",t)}}},_buildReflectionHTML(e){var g,h,v,b,x,I;const t=e.profiles||{},i=t.name||"Community Member",o=t.avatar_url||"",n=window.Core.getAvatarGradient(t.id||e.id),r=this._timeAgo(e.created_at),l=t.id===((v=(h=(g=window.Core)==null?void 0:g.state)==null?void 0:h.currentUser)==null?void 0:v.id),a=(I=(x=(b=window.Core)==null?void 0:b.state)==null?void 0:x.currentUser)==null?void 0:I.is_admin,s=this.state.appreciatedReflections.has(e.id),d=o?`<img src="${o}" alt="${this._esc(i)}" width="40" height="40" loading="lazy" decoding="async">`:this._esc(t.emoji||i.charAt(0).toUpperCase()),u=o?"background:transparent;":`background:${n};`,m=l?`
            <div style="margin-left:auto;display:flex;gap:4px;">
                <button type="button" onclick="CommunityModule.editReflection('${e.id}')"   class="ref-action" title="Edit"           style="font-size:14px;opacity:0.6;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button type="button" onclick="CommunityModule.deleteReflection('${e.id}')" class="ref-action" title="Delete"         style="font-size:14px;opacity:0.6;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>`:a?`
            <div style="margin-left:auto;display:flex;gap:4px;">
                <button type="button" onclick="CommunityModule.deleteReflection('${e.id}')" class="ref-action" title="Delete (Admin)" style="font-size:14px;opacity:0.6;color:var(--neuro-accent);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>`:"";return`
            <div class="reflection" data-reflection-id="${e.id}">
                <div class="ref-header">
                    <div class="ref-avatar" style="${u}cursor:pointer;"
                         onclick="CommunityModule.viewMember('${t.id}')">
                        ${d}
                    </div>
                    <div class="ref-meta">
                        <div class="ref-author" style="cursor:pointer;"
                             onclick="CommunityModule.viewMember('${t.id}')">
                            ${this._esc(i)}
                        </div>
                        <div class="ref-time">${r}</div>
                    </div>
                </div>
                <div class="ref-content">${this._esc(e.content)}</div>
                <div class="ref-actions">
                    <button type="button" class="ref-action ${s?"appreciated":""}"
                            onclick="CommunityModule.appreciate(this, '${e.id}')">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg></span>
                        <span class="appreciation-count">Appreciate (${e.appreciation_count||0})</span>
                    </button>
                    <button type="button" class="ref-action" onclick="CommunityModule.whisper('${t.id}')">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span>Whisper</span>
                    </button>
                    ${m}
                </div>
            </div>`},subscribeToNewReflections(){if(!(c!=null&&c.ready)){const t=setInterval(()=>{c!=null&&c.ready&&(clearInterval(t),this.subscribeToNewReflections())},300);return}if(!c.subscribeToReflections(async t=>{var o,n,r,l,a;((o=t.profiles)==null?void 0:o.id)===((l=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)==null?void 0:l.id)||(await c.getBlockedUsers()).has((a=t.profiles)==null?void 0:a.id)||this._prependReflection(t)})){const t=setInterval(()=>{c!=null&&c.ready&&(clearInterval(t),this.subscribeToNewReflections())},300)}},_prependReflection(e){const t=document.getElementById("reflectionsContainer");if(!t)return;const i=document.createElement("div");i.innerHTML=this._buildReflectionHTML(e);const o=i.firstElementChild;o&&t.insertBefore(o,t.firstChild)},async shareReflection(){const e=document.getElementById("reflectionInput");if(!e)return;const t=e.value.trim();if(t.length<this.config.MIN_REFLECTION_LENGTH){window.Core.showToast("Please write something first");return}if(t.length>this.config.MAX_REFLECTION_LENGTH){window.Core.showToast(`Reflection too long (max ${this.config.MAX_REFLECTION_LENGTH} characters)`);return}try{const i=await c.postReflection(t);if(!i){window.Core.showToast("Could not share reflection - please try again");return}e.value="";const o=document.getElementById("charCount");o&&(o.textContent="0"),this._prependReflection(i),window.Core.showToast("Reflection shared with the community")}catch(i){console.error("[CommunityModule] shareReflection error:",i)}},async deleteReflection(e){var i;if(!confirm("Remove this reflection?"))return;await c.deleteReflection(e)?((i=document.querySelector(`[data-reflection-id="${e}"]`))==null||i.remove(),window.Core.showToast("Reflection removed")):window.Core.showToast("Could not remove reflection")},editReflection(e){const t=document.querySelector(`[data-reflection-id="${e}"]`),i=t==null?void 0:t.querySelector(".ref-content");if(!i)return;const o=i.textContent.trim();i.innerHTML=`
            <textarea id="editReflectionInput_${e}" maxlength="500" rows="3"
                      style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);
                             background:var(--surface);color:var(--text);resize:vertical;
                             font-size:14px;line-height:1.6;box-sizing:border-box;"
            >${this._esc(o)}</textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                <span style="font-size:11px;color:var(--text-muted)">
                    <span id="editCharCount_${e}">${o.length}</span>/500
                </span>
                <div style="display:flex;gap:8px;">
                    <button type="button" onclick="CommunityModule.saveEditReflection('${e}')"
                            style="padding:5px 14px;background:var(--accent);color:#fff;border:none;
                                   border-radius:var(--radius-md);cursor:pointer;font-size:13px;font-weight:600;">Save</button>
                    <button type="button" onclick="CommunityModule.cancelEditReflection('${e}')"
                            style="padding:5px 12px;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                   color:var(--neuro-text);border:none;border-radius:var(--radius-md);cursor:pointer;font-size:13px;">Cancel</button>
                </div>
            </div>`;const n=document.getElementById(`editReflectionInput_${e}`);n&&(this._setupCharCounter(`editReflectionInput_${e}`,`editCharCount_${e}`),n.focus(),n.setSelectionRange(n.value.length,n.value.length))},cancelEditReflection(e){const t=document.querySelector(`[data-reflection-id="${e}"]`),i=t==null?void 0:t.querySelector(".ref-content");i&&c.getReflections(20).then(o=>{const n=o.find(r=>r.id===e);n&&(i.textContent=n.content)}).catch(()=>{})},async saveEditReflection(e){const t=document.getElementById(`editReflectionInput_${e}`);if(!t)return;const i=t.value.trim();if(!i){window.Core.showToast("Reflection cannot be empty");return}if(i.length>500){window.Core.showToast("Too long (max 500 characters)");return}if(t.disabled=!0,await c.updateReflection(e,i)){const n=document.querySelector(`[data-reflection-id="${e}"] .ref-content`);n&&(n.textContent=i),window.Core.showToast("Reflection updated")}else t.disabled=!1,window.Core.showToast("Could not update - please try again")},async appreciate(e,t){if(!(!e||!t))try{const i=this.state.appreciatedReflections.has(t),o=await c.toggleAppreciation(t,i);if(!o)return;this.state.appreciatedReflections[o.appreciated?"add":"delete"](t),e.classList.toggle("appreciated",o.appreciated);const n=await c.getReflectionCount(t),r=e.querySelector(".appreciation-count");r&&n!==null&&(r.textContent=`Appreciate (${n})`)}catch(i){console.error("[CommunityModule] appreciate error:",i)}},async whisper(e){if(e)try{const t=await c.getProfile(e);WhisperModal.openThread(e,(t==null?void 0:t.name)||"Member",(t==null?void 0:t.emoji)||"",(t==null?void 0:t.avatar_url)||"")}catch{WhisperModal.openThread(e,"Member","","")}},renderMembers(){},viewMember(e){e&&(window.MemberProfileModal?MemberProfileModal.open(e):window.Core.showToast("Member profiles loading..."))},renderWaves(){const e=document.getElementById("wavesContainer");if(!e)return;const t=[{id:1,title:"Evening Wind Down",time:"Tonight at 8:00 PM",participants:42,progress:67},{id:2,title:"Sunday Morning Stillness",time:"Tomorrow at 7:00 AM",participants:28,progress:45}];e.innerHTML=t.map(i=>`
            <div class="wave-card" data-wave-id="${i.id}">
                <div class="wave-header">
                    <div>
                        <div class="wave-title">${this._esc(i.title)}</div>
                        <div class="wave-meta">${this._esc(i.time)} • ${i.participants} joined</div>
                    </div>
                </div>
                <div class="prog-bar">
                    <div class="prog-fill" style="width:${Math.min(100,Math.max(0,i.progress))}%"></div>
                </div>
                <button type="button" class="contrib-btn" onclick="CommunityModule.contributeWave(${i.id})">
                    Contribute 20 Minutes
                </button>
            </div>`).join("")},contributeWave(){window.Core.showToast("Contribution recorded! Start your practice.")},showCrisisModal(){this.openModal("crisisModal")},closeCrisisModal(){this.closeModal("crisisModal")},showReportModal(e=null){this.state.reportingUserId=e,this.openModal("reportModal")},closeReportModal(){this.closeModal("reportModal"),this._clearFields(["reportReason","reportDetails"]),this.state.reportingUserId=null},async submitReport(){var o,n,r;const e=(o=document.getElementById("reportReason"))==null?void 0:o.value,t=((r=(n=document.getElementById("reportDetails"))==null?void 0:n.value)==null?void 0:r.trim())||"";if(!e){window.Core.showToast("Please select a reason");return}await c.submitReport(this.state.reportingUserId,e,t)?(window.Core.showToast("Report submitted. Thank you for keeping the space safe."),this.closeReportModal()):window.Core.showToast("Could not submit report - please try again")},showBlockModal(){this.openModal("blockModal")},closeBlockModal(){this.closeModal("blockModal"),this._clearFields(["blockUsername"])},async confirmBlock(){var o,n;const e=(n=(o=document.getElementById("blockUsername"))==null?void 0:o.value)==null?void 0:n.trim();if(!e){window.Core.showToast("Please enter a username");return}const t=await c.getUserByName(e);if(!t){window.Core.showToast("User not found");return}await c.blockUser(t.id)?(window.Core.showToast(`${t.name} has been blocked`),this.closeBlockModal(),await this.renderReflections()):window.Core.showToast("Could not block user - please try again")},hideMessagesFromUser(e){document.querySelectorAll(".chat-msg").forEach(t=>{var i;(i=t.querySelector("div"))!=null&&i.textContent.includes(e)&&(t.style.display="none")})},showHelpModal(){this.openModal("helpModal")},closeHelpModal(){this.closeModal("helpModal")},needHelp(){this.showHelpModal()},showModeratorModal(){this.closeHelpModal(),this.openModal("moderatorModal")},closeModeratorModal(){this.closeModal("moderatorModal"),this._clearFields(["moderatorMessage"]);const e=document.getElementById("moderatorUrgency");e&&(e.value="low")},contactModerator(){this.showModeratorModal()},submitModeratorRequest(){var t,i;const e=(i=(t=document.getElementById("moderatorMessage"))==null?void 0:t.value)==null?void 0:i.trim();if(!e||e.length<this.config.MIN_MODERATOR_MESSAGE_LENGTH){window.Core.showToast(`Please describe your situation (at least ${this.config.MIN_MODERATOR_MESSAGE_LENGTH} characters)`);return}window.Core.showToast("Request sent. A moderator will reach out shortly."),this.closeModeratorModal()},showTechnicalModal(){this.closeHelpModal(),this.openModal("technicalModal")},closeTechnicalModal(){this.closeModal("technicalModal"),this._clearFields(["technicalType","technicalDescription","technicalDevice"])},reportTechnicalIssue(){this.showTechnicalModal()},submitTechnicalIssue(){var i,o,n;const e=(i=document.getElementById("technicalType"))==null?void 0:i.value,t=(n=(o=document.getElementById("technicalDescription"))==null?void 0:o.value)==null?void 0:n.trim();if(!e){window.Core.showToast("Please select an issue type");return}if(!t||t.length<this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH){window.Core.showToast(`Please provide more details (at least ${this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH} characters)`);return}window.Core.showToast("Issue reported. Our tech team will investigate."),this.closeTechnicalModal()},showGuidelinesModal(){this.closeHelpModal(),this.openModal("guidelinesModal")},closeGuidelinesModal(){this.closeModal("guidelinesModal")},viewGuidelines(){this.showGuidelinesModal()},muteChat(){var i;const e=document.getElementById("psSidebar");if(!e)return;const t=e.classList.contains("muted");e.classList.toggle("muted"),window.Core.showToast(t?"Chat unmuted":"Chat muted"),!t&&e.classList.contains("open")&&(e.classList.remove("open"),(i=document.getElementById("fabChat"))==null||i.classList.remove("hidden"))},registerEvent(){window.Core.showToast("Registration confirmed! Check your email.")},openModal(e){const t=document.getElementById(e);t?t.classList.add("active"):console.warn(`[CommunityModule] Modal not found: ${e}`)},closeModal(e){var t;(t=document.getElementById(e))==null||t.classList.remove("active")},_setupCharCounter(e,t){const i=document.getElementById(e),o=document.getElementById(t);i&&o&&i.addEventListener("input",()=>{o.textContent=i.value.length})},_clearFields(e){e.forEach(t=>{const i=document.getElementById(t);i&&(i.value="")})},_timeAgo(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),i=Math.floor(t/6e4),o=Math.floor(t/36e5),n=Math.floor(t/864e5);return i<1?"Just now":i<60?`${i}m ago`:o<24?`${o}h ago`:`${n}d ago`},_esc(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}};window.CommunityModule=Le;const Ze=Object.freeze(Object.defineProperty({__proto__:null,CommunityModule:Le},Symbol.toStringTag,{value:"Module"})),L={state:{modalsInjected:!1},init(){},injectModals(){const e=!!document.getElementById("reportModal");if(this.state.modalsInjected&&!e&&(this.state.modalsInjected=!1),!(this.state.modalsInjected||e))try{document.body.insertAdjacentHTML("beforeend",this.getAllModalsHTML()),this.state.modalsInjected=!0}catch(t){console.error("Failed to inject SafetyBar modals:",t)}},getAllModalsHTML(){return`
            ${this.getCrisisModalHTML()}
            ${this.getReportModalHTML()}
            ${this.getBlockModalHTML()}
            ${this.getHelpModalHTML()}
            ${this.getModeratorModalHTML()}
            ${this.getTechnicalModalHTML()}
            ${this.getGuidelinesModalHTML()}
        `},getCrisisModalHTML(){return`
    <div class="modal-overlay" id="crisisModal" onclick="SafetyBar.handleOverlayClick(event,'crisis')">
        <div class="modal-card" style="max-width:500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('crisis')" aria-label="Close crisis resources">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg> Crisis Resources</h2>
                <div style="line-height:1.8;color:var(--text);font-size:14px;">
                    <p style="margin-bottom:20px;"><strong>If you're in crisis, please reach out immediately.</strong></p>
                    <div style="background:#fee;border-left:4px solid #c33;padding:16px;margin-bottom:20px;border-radius:var(--radius-md);">
                        <strong>🚨 Emergency:</strong> Call 911 (US) or your local emergency number
                    </div>
                    <h3 style="font-size:16px;margin-top:20px;margin-bottom:10px;">24/7 Hotlines:</h3>
                    <ul style="padding-left:20px;">
                        <li style="margin-bottom:12px;"><strong>National Suicide Prevention Lifeline:</strong><br>988 or 1-800-273-8255</li>
                        <li style="margin-bottom:12px;"><strong>Crisis Text Line:</strong><br>Text HOME to 741741</li>
                        <li style="margin-bottom:12px;"><strong>SAMHSA National Helpline:</strong><br>1-800-662-4357</li>
                    </ul>
                </div>
                <button onclick="SafetyBar.closeModal('crisis')"
                        style="width:100%;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;margin-top:16px;">
                    Close
                </button>
            </div>
        </div>
    </div>`},getReportModalHTML(){return`
    <div class="modal-overlay" id="reportModal" onclick="SafetyBar.handleOverlayClick(event,'report')">
        <div class="modal-card" style="max-width:500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('report')" aria-label="Close report modal">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Report Issue</h2>
                <div style="margin-bottom:20px;">
                    <label for="reportReason" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">What happened?</label>
                    <select id="reportReason" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                        <option value="">Select a reason...</option>
                        <option value="harassment">Harassment or bullying</option>
                        <option value="spam">Spam or advertising</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="safety">Safety concern</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label for="reportDetails" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Details (optional)</label>
                    <textarea id="reportDetails" placeholder="Please provide any additional context..."
                              style="width:100%;min-height:100px;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;resize:vertical;"></textarea>
                </div>
                <div style="padding:16px;background:var(--season-mood);border-radius:var(--radius-md);margin-bottom:20px;font-size:13px;line-height:1.6;">
                    Reports are reviewed within 24 hours. Serious violations are addressed immediately.
                </div>
                <div style="display:flex;gap:12px;">
                    <button onclick="SafetyBar.closeModal('report')"
                            style="flex:1;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.submitReport()"
                            style="flex:1;padding:12px 24px;border:none;background:var(--text);color:var(--season-mood);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    </div>`},getBlockModalHTML(){return`
    <div class="modal-overlay" id="blockModal" onclick="SafetyBar.handleOverlayClick(event,'block')">
        <div class="modal-card" style="max-width:450px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('block')" aria-label="Close block modal">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Block User</h2>
                <p style="margin-bottom:20px;line-height:1.6;">Blocked users won't be able to see your messages or interact with you.</p>
                <div style="margin-bottom:20px;">
                    <label for="blockUsername" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Username to block</label>
                    <input type="text" id="blockUsername" placeholder="Enter username..."
                           style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                </div>
                <div style="padding:16px;background:var(--season-mood);border-radius:var(--radius-md);margin-bottom:20px;font-size:13px;line-height:1.6;">
                    <strong>Note:</strong> You can unblock users anytime from your settings.
                </div>
                <div style="display:flex;gap:12px;">
                    <button onclick="SafetyBar.closeModal('block')"
                            style="flex:1;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.confirmBlock()"
                            style="flex:1;padding:12px 24px;border:none;background:var(--text);color:var(--season-mood);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Block User
                    </button>
                </div>
            </div>
        </div>
    </div>`},getHelpModalHTML(){return`
    <div class="modal-overlay" id="helpModal" onclick="SafetyBar.handleOverlayClick(event,'help')">
        <div class="modal-card" style="max-width:500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('help')" aria-label="Close help modal">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Get Help</h2>
                <div style="line-height:1.6;font-size:14px;">
                    <p style="margin-bottom:16px;">Choose the support you need:</p>
                    <button onclick="SafetyBar._switchModal('help','crisis')"
                            style="width:100%;padding:16px;margin-bottom:12px;text-align:left;background:#fee;border:2px solid #c33;border-radius:var(--radius-md);cursor:pointer;font-size:14px;">
                        <strong>🆘 Crisis Resources</strong><br>
                        <span style="font-size:12px;color:#666;">24/7 hotlines and emergency support</span>
                    </button>
                    <div style="margin-bottom:12px;border:2px solid var(--border);border-radius:var(--radius-md);overflow:hidden;">
                        <button onclick="SafetyBar.toggleHelpMePanel()"
                                style="width:100%;padding:16px;text-align:left;background:var(--surface);border:none;cursor:pointer;font-size:14px;">
                            <strong>🆘 Help Me</strong><br>
                            <span style="font-size:12px;color:var(--text-muted);">Send a quick message directly to the admin</span>
                        </button>
                        <div id="helpMePanel" style="display:none;padding:12px 16px 16px;background:var(--surface);border-top:1px solid var(--border);">
                            <textarea id="helpMeText" placeholder="What's happening? We're here..." rows="3"
                                      style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);
                                             background:var(--season-mood);font-size:13px;resize:none;
                                             box-sizing:border-box;margin-bottom:10px;"></textarea>
                            <button onclick="SafetyBar.submitHelpMe()"
                                    style="width:100%;padding:10px;border:none;border-radius:8px;cursor:pointer;
                                           font-size:13px;font-weight:700;background:var(--text);color:var(--season-mood);">
                                Send to Admin
                            </button>
                        </div>
                    </div>
                    <button onclick="SafetyBar._switchModal('help','technical')"
                            style="width:100%;padding:16px;margin-bottom:12px;text-align:left;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-md);cursor:pointer;font-size:14px;">
                        <strong>🔧 Technical Issue</strong><br>
                        <span style="font-size:12px;color:var(--text-muted);">Report bugs or problems</span>
                    </button>
                    <button onclick="SafetyBar._switchModal('help','guidelines')"
                            style="width:100%;padding:16px;text-align:left;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-md);cursor:pointer;font-size:14px;">
                        <strong>📜 Community Guidelines</strong><br>
                        <span style="font-size:12px;color:var(--text-muted);">Learn about our values and rules</span>
                    </button>
                </div>
                <button onclick="SafetyBar.closeModal('help')"
                        style="width:100%;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;margin-top:16px;">
                    Close
                </button>
            </div>
        </div>
    </div>`},getModeratorModalHTML(){return`
    <div class="modal-overlay" id="moderatorModal" onclick="SafetyBar.handleOverlayClick(event,'moderator')">
        <div class="modal-card" style="max-width:500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('moderator')" aria-label="Close moderator contact">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Contact Moderator</h2>
                <div style="margin-bottom:20px;">
                    <label for="moderatorUrgency" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Urgency Level</label>
                    <select id="moderatorUrgency" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Urgent matter</option>
                        <option value="immediate">Immediate - Safety concern</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label for="moderatorMessage" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">How can we help?</label>
                    <textarea id="moderatorMessage" placeholder="Describe your situation..."
                              style="width:100%;min-height:120px;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;resize:vertical;"></textarea>
                </div>
                <div style="padding:16px;background:var(--season-mood);border-radius:var(--radius-md);margin-bottom:20px;font-size:13px;line-height:1.6;">
                    <strong>Available 24/7</strong> - A moderator will respond based on your urgency level. For immediate safety concerns, select "Immediate" above.
                </div>
                <div style="display:flex;gap:12px;">
                    <button onclick="SafetyBar.closeModal('moderator')"
                            style="flex:1;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.submitModeratorRequest()"
                            style="flex:1;padding:12px 24px;border:none;background:var(--text);color:var(--season-mood);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    </div>`},getTechnicalModalHTML(){return`
    <div class="modal-overlay" id="technicalModal" onclick="SafetyBar.handleOverlayClick(event,'technical')">
        <div class="modal-card" style="max-width:500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('technical')" aria-label="Close technical issue modal">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Report Technical Issue</h2>
                <div style="margin-bottom:20px;">
                    <label for="technicalType" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Issue Type</label>
                    <select id="technicalType" style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                        <option value="">Select issue type...</option>
                        <option value="audio">Audio/Sound not working</option>
                        <option value="timer">Timer malfunction</option>
                        <option value="chat">Chat issues</option>
                        <option value="connection">Connection problems</option>
                        <option value="display">Display/Visual issues</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label for="technicalDescription" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Description</label>
                    <textarea id="technicalDescription" placeholder="What happened? What were you trying to do?"
                              style="width:100%;min-height:100px;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;resize:vertical;"></textarea>
                </div>
                <div style="margin-bottom:20px;">
                    <label for="technicalDevice" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Browser & Device</label>
                    <input type="text" id="technicalDevice" placeholder="e.g., Chrome on Mac, Firefox on Windows"
                           style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                </div>
                <div style="display:flex;gap:12px;">
                    <button onclick="SafetyBar.closeModal('technical')"
                            style="flex:1;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.submitTechnicalIssue()"
                            style="flex:1;padding:12px 24px;border:none;background:var(--text);color:var(--season-mood);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;">
                        Submit Issue
                    </button>
                </div>
            </div>
        </div>
    </div>`},getGuidelinesModalHTML(){return`
    <div class="modal-overlay" id="guidelinesModal" onclick="SafetyBar.handleOverlayClick(event,'guidelines')">
        <div class="modal-card" style="max-width:600px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('guidelines')" aria-label="Close guidelines">×</button>
            <div class="modal-content" style="text-align:left;">
                <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:20px;text-align:center;" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 3H8a2 2 0 0 0-2 2v12"/><path d="M14 11h4"/><path d="M14 15h4"/><path d="M10 11h.01"/><path d="M10 15h.01"/></svg> Community Guidelines</h2>
                <div style="line-height:1.8;color:var(--text);font-size:14px;">
                    <p style="margin-bottom:20px;"><strong>Welcome to our mindful community.</strong> These guidelines help us create a safe, supportive space for everyone.</p>
                    <h3 style="font-size:16px;margin-top:20px;margin-bottom:10px;" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Our Core Values</h3>
                    <ul style="padding-left:20px;">
                        <li style="margin-bottom:8px;"><strong>Kindness:</strong> Treat all members with compassion and respect</li>
                        <li style="margin-bottom:8px;"><strong>Presence:</strong> Be fully here, authentic and engaged</li>
                        <li style="margin-bottom:8px;"><strong>Non-judgment:</strong> Honor each person's unique journey</li>
                        <li style="margin-bottom:8px;"><strong>Confidentiality:</strong> What's shared in spaces stays in spaces</li>
                    </ul>
                    <h3 style="font-size:16px;margin-top:20px;margin-bottom:10px;" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg> Expected Behavior</h3>
                    <ul style="padding-left:20px;">
                        <li style="margin-bottom:8px;">Use respectful, inclusive language</li>
                        <li style="margin-bottom:8px;">Honor the intention of each space (silence in silent rooms)</li>
                        <li style="margin-bottom:8px;">Support others without giving unsolicited advice</li>
                        <li style="margin-bottom:8px;">Respect boundaries and consent</li>
                        <li style="margin-bottom:8px;">Report concerns to moderators</li>
                    </ul>
                    <h3 style="font-size:16px;margin-top:20px;margin-bottom:10px;" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Not Permitted</h3>
                    <ul style="padding-left:20px;">
                        <li style="margin-bottom:8px;">Harassment, bullying, or hate speech</li>
                        <li style="margin-bottom:8px;">Spam or commercial solicitation</li>
                        <li style="margin-bottom:8px;">Sharing others' personal information</li>
                        <li style="margin-bottom:8px;">Impersonation or deception</li>
                        <li style="margin-bottom:8px;">Inappropriate or explicit content</li>
                    </ul>
                    <p style="margin-top:20px;padding:16px;background:var(--season-mood);border-radius:var(--radius-md);font-size:13px;">
                        <strong>Questions?</strong> Contact our moderators anytime. Violations may result in warnings, temporary suspension, or permanent removal.
                    </p>
                </div>
                <button onclick="SafetyBar.closeModal('guidelines')"
                        style="width:100%;padding:12px 24px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:14px;margin-top:16px;">
                    Close
                </button>
            </div>
        </div>
    </div>`},handleOverlayClick(e,t){e.target===e.currentTarget&&this.closeModal(t)},openModal(e){this.injectModals();const t=document.getElementById(`${e}Modal`);t?t.classList.add("active"):console.warn(`[SafetyBar] openModal: #${e}Modal not found`)},closeModal(e){var t;(t=document.getElementById(`${e}Modal`))==null||t.classList.remove("active")},_switchModal(e,t){this.closeModal(e),this.openModal(t)},async submitReport(){var i,o,n,r,l;const e=(i=document.getElementById("reportReason"))==null?void 0:i.value,t=(n=(o=document.getElementById("reportDetails"))==null?void 0:o.value)==null?void 0:n.trim();if(!e){window.Core.showToast("Please select a reason");return}(l=(r=window.Community)==null?void 0:r.submitReport)==null||l.call(r);try{await this._writeAdminNotification("report",{reason:e,details:t,room:this._getCurrentRoom()}),await this._pushAdmins("⚠️ New Report",`${this._senderName()} reported: ${e}${t?" - "+t.substring(0,60):""}`)}catch(a){console.error("submitReport admin notify error:",a)}},confirmBlock(){var e;typeof((e=window.Community)==null?void 0:e.confirmBlock)=="function"?window.Community.confirmBlock():console.error("Community.confirmBlock not available")},toggleHelpMePanel(){const e=document.getElementById("helpMePanel");e&&(e.style.display=e.style.display==="none"?"block":"none")},async submitHelpMe(){var i,o;const e=(o=(i=document.getElementById("helpMeText"))==null?void 0:i.value)==null?void 0:o.trim();if(!e){window.Core.showToast("Please write a short message");return}const t=document.querySelector("#helpMePanel button");t&&(t.disabled=!0,t.textContent="Sending...");try{await this._writeAdminNotification("help",{message:e,room:this._getCurrentRoom()}),await this._pushAdmins("🆘 Help Request",`${this._senderName()} needs help: "${e.substring(0,80)}"`),window.Core.showToast("Your message was sent to the admin"),document.getElementById("helpMeText").value="",document.getElementById("helpMePanel").style.display="none",this.closeModal("help")}catch(n){console.error("submitHelpMe error:",n),window.Core.showToast("Could not send - please try again")}finally{t&&(t.disabled=!1,t.textContent="Send to Admin")}},async submitModeratorRequest(){var i,o,n;const e=(i=document.getElementById("moderatorUrgency"))==null?void 0:i.value,t=(n=(o=document.getElementById("moderatorMessage"))==null?void 0:o.value)==null?void 0:n.trim();try{await this._writeAdminNotification("moderator",{urgency:e,message:t,room:this._getCurrentRoom()}),await this._pushAdmins("👥 Moderator Request",`${this._senderName()} [${e}]: ${t?t.substring(0,80):"-"}`),window.Core.showToast("Moderator contacted"),this.closeModal("moderator")}catch(r){console.error("submitModeratorRequest error:",r),window.Core.showToast("Could not send - please try again")}},async submitTechnicalIssue(){var o,n,r,l,a,s,d;const e=(o=document.getElementById("technicalType"))==null?void 0:o.value,t=(r=(n=document.getElementById("technicalDescription"))==null?void 0:n.value)==null?void 0:r.trim(),i=(a=(l=document.getElementById("technicalDevice"))==null?void 0:l.value)==null?void 0:a.trim();(d=(s=window.Community)==null?void 0:s.submitTechnicalIssue)==null||d.call(s);try{await this._writeAdminNotification("technical",{issueType:e,description:t,device:i,room:this._getCurrentRoom()}),await this._pushAdmins("🔧 Technical Issue",`${this._senderName()}: ${e||"issue"}${t?" - "+t.substring(0,60):""}`)}catch(u){console.error("submitTechnicalIssue admin notify error:",u)}},async _writeAdminNotification(e,t){if(!(c!=null&&c.ready))return;const{error:i}=await c._sb.from("admin_notifications").insert({type:e,from_user_id:c.userId||null,payload:{...t,sender_name:this._senderName(),timestamp:new Date().toISOString()}});i&&console.error("[SafetyBar] _writeAdminNotification:",i.message)},async _pushAdmins(e,t){if(c!=null&&c.ready)try{const[{data:i}]=await Promise.all([c._sb.from("profiles").select("id").eq("is_admin",!0)]);if(!(i!=null&&i.length))return;const{data:o}=await c._sb.from("push_subscriptions").select("subscription").in("user_id",i.map(n=>n.id));if(!(o!=null&&o.length))return;await Promise.allSettled(o.map(n=>fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sub:n.subscription,payload:{title:e,body:t,icon:"/icons/icon-192x192.png",data:{url:"/"}}})}).catch(()=>{})))}catch(i){console.error("[SafetyBar] _pushAdmins error:",i)}},_getCurrentRoom(){var e,t;return((t=(e=document.querySelector(".room-title, .room-name-inline, #roomTitle"))==null?void 0:e.textContent)==null?void 0:t.trim())||"Community Hub"},_senderName(){var e,t,i;return((i=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)==null?void 0:i.name)||"A member"}};(function(){const e={showReportModal:()=>L.openModal("report"),showBlockModal:()=>L.openModal("block"),showHelpModal:()=>L.openModal("help"),showCrisisModal:()=>L.openModal("crisis"),showModeratorModal:()=>L.openModal("moderator"),showTechnicalModal:()=>L.openModal("technical"),showGuidelinesModal:()=>L.openModal("guidelines"),muteChat:()=>{var t,i;return(i=(t=window.Core)==null?void 0:t.showToast)==null?void 0:i.call(t,"Chat muted")},closeReportModal:()=>L.closeModal("report"),closeBlockModal:()=>L.closeModal("block"),closeHelpModal:()=>L.closeModal("help"),closeCrisisModal:()=>L.closeModal("crisis"),closeModeratorModal:()=>L.closeModal("moderator"),closeTechnicalModal:()=>L.closeModal("technical"),closeGuidelinesModal:()=>L.closeModal("guidelines")};window.CommunityModule?Object.keys(e).forEach(t=>{typeof window.CommunityModule[t]!="function"&&(window.CommunityModule[t]=e[t])}):window.CommunityModule=e})();window.SafetyBar=L;const Je=Object.freeze(Object.defineProperty({__proto__:null,SafetyBar:L},Symbol.toStringTag,{value:"Module"})),j=()=>window.CollectiveField,ve=()=>{var e,t,i,o;return((e=window.CommunityDB)==null?void 0:e.userId)||((o=(i=(t=window.Core)==null?void 0:t.state)==null?void 0:i.currentUser)==null?void 0:o.id)||null},Q={_realtimeChannels:{},_pollInterval:null,POLL_INTERVAL_MS:3e4,async init(){try{await this._ensureTodayRow(),await this.loadAll(),this._subscribeRealtime(),this._startPolling()}catch(e){console.error("[CollectiveFieldDB] init error:",e)}},async loadAll(){await Promise.all([this.loadFieldState(),this.loadRecentSenders(),this.loadWaveTotal(),this.loadWaveParticipants(),this.loadUserContribution()])},get _sb(){return window.AppSupabase||window.CommunitySupabase||null},_todayUTC(){return new Date().toISOString().slice(0,10)},_err(e,t){console.error(`[CollectiveFieldDB] ${e}:`,t)},async _ensureTodayRow(){const e=this._todayUTC(),{data:t,error:i}=await this._sb.from("collective_field").select("id").eq("date",e).maybeSingle();if(i)throw i;if(!t){const{error:o}=await this._sb.from("collective_field").insert({date:e,energy_level:0,pulse_count_today:0});if(o)throw o}},async loadFieldState(){const{data:e,error:t}=await this._sb.from("collective_field").select("energy_level, pulse_count_today").eq("date",this._todayUTC()).single();if(t){this._err("loadFieldState",t);return}j().updateEnergyLevel(e.energy_level),j().updateCommunityPulseCount(e.pulse_count_today)},async loadRecentSenders(){const{data:e,error:t}=await this._sb.from("collective_pulses").select("user_id, profiles(emoji, avatar_url)").eq("date",this._todayUTC()).order("created_at",{ascending:!1}).limit(5);if(t){this._err("loadRecentSenders",t);return}j().updateRecentSenders((e||[]).map(i=>{var o,n;return{emoji:((o=i.profiles)==null?void 0:o.emoji)||"🧘",avatarUrl:((n=i.profiles)==null?void 0:n.avatar_url)||null}}))},async recordPulse(){const e=ve();if(!e){this._err("recordPulse","no userId");return}const t=this._todayUTC(),{error:i}=await this._sb.rpc("increment_field_pulse",{p_date:t,p_energy_add:5});if(i){this._err("recordPulse RPC",i);return}const{error:o}=await this._sb.from("collective_pulses").insert({user_id:e,date:t});o&&this._err("recordPulse insert",o)},async loadWaveTotal(){const{data:e,error:t}=await this._sb.from("wave_contributions").select("minutes").eq("date",this._todayUTC());if(t){this._err("loadWaveTotal",t);return}j().updateWaveTotalMinutes((e||[]).reduce((i,o)=>i+(o.minutes||0),0))},async loadWaveParticipants(){const{data:e,error:t}=await this._sb.from("wave_contributions").select("user_id").eq("date",this._todayUTC());if(t){this._err("loadWaveParticipants",t);return}j().updateWaveParticipants(new Set((e||[]).map(i=>i.user_id)).size)},async loadUserContribution(){const e=ve();if(!e)return;const t=this._todayUTC(),[{data:i,error:o},{data:n,error:r}]=await Promise.all([this._sb.from("wave_contributions").select("minutes").eq("user_id",e).eq("date",t),this._sb.from("wave_contributions").select("minutes").eq("user_id",e)]);if(o){this._err("loadUserContribution today",o);return}if(r){this._err("loadUserContribution allTime",r);return}const l=a=>(a||[]).reduce((s,d)=>s+(d.minutes||0),0);j().updateUserContribution(l(i),l(n))},async logWaveContribution(e,t){const i=ve();if(!i){this._err("logWaveContribution","no userId");return}if(e<1)return;const{error:o}=await this._sb.from("wave_contributions").insert({user_id:i,date:this._todayUTC(),minutes:e,completed:t});if(o){this._err("logWaveContribution",o);return}await Promise.all([this.loadWaveTotal(),this.loadWaveParticipants()])},_subscribeRealtime(){const e=this._todayUTC();this._realtimeChannels.field=this._sb.channel("collective_field_changes").on("postgres_changes",{event:"UPDATE",schema:"public",table:"collective_field",filter:`date=eq.${e}`},({new:t})=>{j().updateEnergyLevel(t.energy_level),j().updateCommunityPulseCount(t.pulse_count_today)}).subscribe(),this._realtimeChannels.pulses=this._sb.channel("collective_pulses_inserts").on("postgres_changes",{event:"INSERT",schema:"public",table:"collective_pulses",filter:`date=eq.${e}`},async({new:t})=>{j().receiveExternalPulse({userId:t.user_id,intensity:.7}),await this.loadRecentSenders()}).subscribe(),this._realtimeChannels.wave=this._sb.channel("wave_contributions_inserts").on("postgres_changes",{event:"INSERT",schema:"public",table:"wave_contributions",filter:`date=eq.${e}`},async({new:t})=>{if(typeof(t==null?void 0:t.minutes)=="number"&&t.minutes>0){const i=j().state.waveTotalMinutes||0;j().updateWaveTotalMinutes(i+t.minutes)}await this.loadWaveParticipants()}).subscribe()},_startPolling(){this._pollInterval&&clearInterval(this._pollInterval),this._pollInterval=setInterval(async()=>{try{await this.loadAll()}catch(e){this._err("poll",e)}},this.POLL_INTERVAL_MS)},destroy(){for(const e of Object.values(this._realtimeChannels))try{e.unsubscribe()}catch{}this._realtimeChannels={},this._pollInterval&&(clearInterval(this._pollInterval),this._pollInterval=null)}};window.addEventListener("pagehide",()=>Q.destroy());window.CollectiveFieldDB=Q;const Qe=Object.freeze(Object.defineProperty({__proto__:null,CollectiveFieldDB:Q},Symbol.toStringTag,{value:"Module"})),Re={state:{isEnabled:!1,isRendered:!1},config:{FEATURE_ENABLED:!1},getHTML(){return this.config.FEATURE_ENABLED?`
            <section class="section" id="resonanceContent" aria-labelledby="resonanceSectionTitle">
                <div class="section-header">
                    <div class="section-title" id="resonanceSectionTitle">Resonance</div>
                    <div style="font-size:12px;color:var(--text-muted);">Community energy field</div>
                </div>
                <div class="resonance-container"></div>
            </section>`:'<div id="resonanceContent" style="display:none;"></div>'},render(){const e=document.getElementById("resonanceContainer");if(!e){console.warn("resonanceContainer not found - skipping resonance render");return}e.innerHTML=this.getHTML(),this.state.isRendered=!0},enable(){var e;if(this.state.isEnabled){console.warn("Resonance already enabled");return}this.config.FEATURE_ENABLED=!0,this.state.isEnabled=!0,this.state.isRendered?this.render():(e=document.getElementById("resonanceContent"))==null||e.style.setProperty("display","block")},disable(){var e;if(!this.state.isEnabled){console.warn("Resonance already disabled");return}this.config.FEATURE_ENABLED=!1,this.state.isEnabled=!1,(e=document.getElementById("resonanceContent"))==null||e.style.setProperty("display","none")},toggle(){this.state.isEnabled?this.disable():this.enable()},getIsEnabled(){return this.config.FEATURE_ENABLED&&this.state.isEnabled},getStatus(){return{featureEnabled:this.config.FEATURE_ENABLED,isEnabled:this.state.isEnabled,isRendered:this.state.isRendered}}};window.Resonance=Re;const et=Object.freeze(Object.defineProperty({__proto__:null,Resonance:Re},Symbol.toStringTag,{value:"Module"})),_e={classes:[{title:"Tarot Masterclass",subtitle:"Learn to read the cards with confidence",info:"Discover the ancient wisdom of tarot through interactive lessons. Suitable for beginners and intermediate practitioners. Small group setting ensures personalized guidance.",type:"🎴 Online Zoom Class",datetime:"Monday, 10:00 AM (GMT+2)",image:"/CTA/Sessions/Sessions4.jpg",whatsapp:"https://wa.me/+972524588767"},{title:"Classic Meditation Masterclass",subtitle:"Foundational techniques for daily practice",info:"Master the essential meditation techniques used for thousands of years. Learn breath control, mindfulness, and deep relaxation methods you can use every day.",type:"🧘 Online Zoom Class",datetime:"Thursday, 12:00 PM (GMT+2)",image:"/CTA/Sessions/Sessions3.jpg",whatsapp:"https://wa.me/+972524588767"}],sessions:[{title:"Private Tarot Spread",subtitle:"Personal reading tailored to your questions",info:"A one-on-one deep dive into your personal journey. Bring your questions about love, career, or life path. Receive guidance and clarity through the cards.",type:"🎴 In-Person or Online",datetime:"Daily • Flexible Hours",image:"/CTA/Sessions/Sessions1.jpg",whatsapp:"https://wa.me/+972524588767"},{title:"Private Reiki Healing Session",subtitle:"Energy healing for balance and wellness",info:"Experience deep relaxation and energetic clearing. Reiki helps release blockages, reduce stress, and restore your natural state of wellbeing. Sessions tailored to your needs.",type:"✨ In-Person or Online",datetime:"Daily • Flexible Hours",image:"/CTA/Sessions/Sessions2.jpg",whatsapp:"https://wa.me/+972524588767"}],state:{classIndex:0,sessionIndex:0,classInterval:null,sessionInterval:null,isInitialized:!1},config:{ROTATION_INTERVAL:15e3,FADE_DURATION:500,CARDS:{classes:{imageId:"classesImage",contentId:"classesContent",cardSelector:".classes-card",ctaText:"Register via WhatsApp",stateKey:"classIndex",intervalKey:"classInterval",slots:["classes0","classes1"]},sessions:{imageId:"sessionsImage",contentId:"sessionsContent",cardSelector:".sessions-card",ctaText:"Book via WhatsApp",stateKey:"sessionIndex",intervalKey:"sessionInterval",slots:["sessions0","sessions1"]}},ADMIN_TABS:[{id:"classes0",label:"◀ Left Flyer 1"},{id:"classes1",label:"◀ Left Flyer 2"},{id:"sessions0",label:"Right Flyer 1 ▶"},{id:"sessions1",label:"Right Flyer 2 ▶"}],FLYER_FILES:{Sessions:["Sessions1.jpg","Sessions2.jpg","Sessions3.jpg","Sessions4.jpg","Sessions5.jpg","Sessions6.jpg","Sessions7.jpg","Sessions8.jpg","Sessions9.jpg"],Workshops:["Workshops1.jpg","Workshops2.jpg","Workshops3.jpg","Workshops4.jpg","Workshops5.jpg","Workshops6.jpg"]}},flyerCatalog:{"Sessions1.jpg":{title:"1 on 1 Private Tarot Reading",subtitle:"A deeply personal reading just for you",info:"Sit down one-on-one for an intimate tarot session tailored entirely to your questions and journey. Whether you seek clarity on love, career, purpose, or personal growth - the cards will meet you exactly where you are.",type:"🎴 In-Person or Online"},"Sessions2.jpg":{title:"1 on 1 Reiki Healing Session",subtitle:"Deep energetic healing, tailored to you",info:"A private Reiki session focused entirely on your energetic field. Release blockages, restore balance, and return to a natural state of ease and wholeness. Each session is intuitive and adapted to what your body and energy most need.",type:"✨ In-Person or Online"},"Sessions3.jpg":{title:"Classic Meditation Class",subtitle:"Timeless techniques for a calm, clear mind",info:"Learn the foundational meditation practices that have been used for thousands of years. Covering breath awareness, body scanning, and silent sitting - this class gives you practical tools you can return to every day.",type:"🧘 Online Zoom Class"},"Sessions4.jpg":{title:"Tarot Masterclass",subtitle:"Read the cards with depth and confidence",info:"An immersive class exploring the full language of tarot - from Major Arcana archetypes to Minor Arcana nuance. Develop your intuition, learn how to construct meaningful spreads, and find your own voice as a reader.",type:"🎴 Online Zoom Class"},"Sessions5.jpg":{title:"OSHO Active Meditations",subtitle:"Move, release, and arrive in stillness",info:"OSHO Active Meditations use dynamic movement, breath, and sound to shake loose tension and mental noise - before arriving at deep inner silence. Suitable for all levels, no experience required.",type:"🌀 In-Person or Online"},"Sessions6.jpg":{title:"Guided Visualization Session",subtitle:"Journey inward through the power of the mind",info:"A deeply relaxing guided session using vivid inner imagery to access clarity, healing, and inspiration. Ideal for stress relief, goal alignment, and connecting with your deeper wisdom.",type:"🌟 In-Person or Online"},"Sessions7.jpg":{title:"E.F.T. Healing Session",subtitle:"Tap into freedom from stress and old patterns",info:"Emotional Freedom Technique (EFT) combines gentle tapping on acupressure points with focused intention to release emotional blocks, reduce anxiety, and shift limiting beliefs held in the body.",type:"🤲 In-Person or Online"},"Sessions8.jpg":{title:"Sivananda Yoga Class",subtitle:"Classical yoga for body, breath, and spirit",info:"A traditional Sivananda yoga class integrating asana, pranayama, relaxation, and mantra. Rooted in the classical five-point system, this class nourishes the whole being - body, mind, and soul.",type:"🕉️ In-Person"},"Sessions9.jpg":{title:"Divine Intimacy Lecture",subtitle:"Explore the sacred relationship with the self",info:"A reflective lecture-style session exploring the deeper dimensions of intimacy - with yourself, with life, and with the divine. Drawing from mystical traditions, this talk invites you into a more tender and conscious way of being.",type:"💫 In-Person or Online"},"Workshops1.jpg":{title:"Tarot Workshop",subtitle:"Your complete introduction to the cards",info:"A full immersive workshop covering the 78-card system, major and minor arcana, spreads, and intuitive reading practice. You will leave with the confidence and foundation to read for yourself and others.",type:"🎴 Workshop"},"Workshops2.jpg":{title:"Reiki Course",subtitle:"Learn to channel healing energy",info:"A comprehensive Reiki training covering the history, principles, hand positions, and attunement process. Whether you are a complete beginner or looking to deepen your practice, this course opens the door to self-healing and healing others.",type:"✨ Workshop"},"Workshops3.jpg":{title:"Meditation Workshop",subtitle:"Build a practice that transforms your life",info:"An experiential workshop exploring multiple meditation styles - from breath-focused techniques to body awareness and mantra-based practice. You will leave with a personalised toolkit and the understanding to maintain a consistent daily practice.",type:"🧘 Workshop"},"Workshops4.jpg":{title:"Rainbow Light-body Workshop",subtitle:"Activate and align your energetic body",info:"A profound workshop working with the subtle energy body, chakra system, and light-body activation. Through guided practices, visualization, and energy work, participants explore the luminous nature of their own being.",type:"🌈 Workshop"},"Workshops5.jpg":{title:"OSHO Camp (3 Days)",subtitle:"Three days of immersive meditation and awakening",info:"A transformative 3-day residential camp using OSHO Active and silent meditations to strip away conditioning and awaken presence. Each day deepens your practice through movement, music, silence, and community.",type:"🌀 3-Day Retreat"},"Workshops6.jpg":{title:"OSHO Camp (4 Days)",subtitle:"Four days of deep immersion and inner freedom",info:"An extended 4-day OSHO residential camp offering a deeper dive into the full spectrum of OSHO meditations. More time means more depth - more silence, more breakthroughs, and more space to simply be.",type:"🌀 4-Day Retreat"}},_flyerBase:"/CTA/",_adminModal:null,_adminActiveTab:"classes0",_adminDraft:{classes0:null,classes1:null,sessions0:null,sessions1:null},_staggerTimeout:null,_lightboxEsc:null,getHTML(){return`
        <section class="section" aria-labelledby="upcomingEventsTitle">
            <div class="section-header">
                <div class="section-title" id="upcomingEventsTitle">Upcoming Events</div>

            </div>
            <div class="events-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                ${this._getCardHTML("classes")}
                ${this._getCardHTML("sessions")}
            </div>
        </section>`},_getCardHTML(e){const t=this.config.CARDS[e],i=this[e][0];return`
        <div class="event-card ${e}-card" style="position:relative;overflow:hidden;">
            ${this._getFlyerHTML(i,t.imageId,this[e].length)}
            ${this._getContentHTML(i,t.contentId,t.ctaText)}
        </div>`},_getFlyerHTML(e,t,i){const o=Array.from({length:i},(n,r)=>`<span class="dot${r===0?" active":""}" data-index="${r}"
                   style="width:8px;height:8px;border-radius:50%;background:white;opacity:${r===0?"1":"0.5"};"></span>`).join("");return`
        <div class="event-flyer" style="position:relative;background:var(--neuro-bg);">
            <img src="${this.escapeHtml(e.image)}" alt="${this.escapeHtml(e.title)}" id="${t}"
                 width="600" height="400"
                 onclick="UpcomingEvents.openLightbox(this.src)"
                 loading="lazy" decoding="async"
                 style="width:100%;height:auto;display:block;transition:opacity ${this.config.FADE_DURATION}ms ease;cursor:zoom-in;">
            <div class="flyer-indicator" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;">
                ${o}
            </div>
        </div>`},_getContentHTML(e,t,i){return`
        <div class="event-content" id="${t}" style="padding:20px;">
            <div class="event-type" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${this.escapeHtml(e.type)}</div>
            <h3 class="event-heading" style="font-family:var(--serif);font-size:20px;margin-bottom:4px;">${this.escapeHtml(e.title)}</h3>
            <div class="event-subheading" style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">${this.escapeHtml(e.subtitle)}</div>
            <div class="event-info" style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:16px;padding:12px;background:var(--neuro-bg);border-radius:var(--radius-sm);border-left:3px solid var(--accent);">
                ${this.escapeHtml(e.info)}
            </div>
            <div class="event-datetime" style="font-size:13px;color:var(--text-muted);margin-bottom:16px;display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${this.escapeHtml(e.datetime)}</div>
            <button type="button" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;width:100%;" onclick="UpcomingEvents.openWhatsApp('${this.escapeHtml(e.whatsapp)}')"
                    aria-label="${this.escapeHtml(i)} for ${this.escapeHtml(e.title)}">
                ${this.escapeHtml(i)}
            </button>
        </div>`},openLightbox(e){if(document.getElementById("flyerLightbox"))return;const t=document.createElement("div");t.id="flyerLightbox",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label","Flyer image"),t.style.cssText=`position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);
            display:flex;align-items:center;justify-content:center;
            cursor:zoom-out;opacity:0;transition:opacity 0.25s ease;`,t.innerHTML=`
            <img src="${e}" width="800" height="600" decoding="async" style="max-width:94vw;max-height:94vh;object-fit:contain;
                border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.6);
                transform:scale(0.95);transition:transform 0.25s ease;">
            <button type="button" onclick="UpcomingEvents.closeLightbox()"
                    aria-label="Close lightbox"
                    style="position:absolute;top:18px;right:22px;background:none;border:none;
                           cursor:pointer;font-size:28px;color:#fff;opacity:0.7;line-height:1;">✕</button>`,document.body.appendChild(t),document.body.style.overflow="hidden",requestAnimationFrame(()=>{t.style.opacity="1",t.querySelector("img").style.transform="scale(1)"}),t.addEventListener("click",i=>{i.target===t&&this.closeLightbox()}),this._lightboxEsc=i=>{i.key==="Escape"&&this.closeLightbox()},document.addEventListener("keydown",this._lightboxEsc)},closeLightbox(){const e=document.getElementById("flyerLightbox");e&&(e.style.opacity="0",setTimeout(()=>{e.remove(),document.body.style.overflow=""},250),this._lightboxEsc&&(document.removeEventListener("keydown",this._lightboxEsc),this._lightboxEsc=null))},initRotation(){this.destroy();const e=(t,i=0)=>{const o=this.config.CARDS[t],n=()=>{this.state[o.stateKey]=(this.state[o.stateKey]+1)%this[t].length,this.updateCard(t,this.state[o.stateKey])};i?this._staggerTimeout=setTimeout(()=>{this.state[o.intervalKey]=setInterval(n,this.config.ROTATION_INTERVAL)},i):this.state[o.intervalKey]=setInterval(n,this.config.ROTATION_INTERVAL)};e("classes"),e("sessions",this.config.ROTATION_INTERVAL/2)},updateCard(e,t){const i=this.config.CARDS[e],o=this[e][t],n=document.getElementById(i.imageId),r=document.getElementById(i.contentId);if(!n||!r){console.warn(`[UpcomingEvents] Elements not found: ${i.imageId} or ${i.contentId}`);return}n.style.opacity="0",setTimeout(()=>{n.src=o.image,n.alt=o.title,r.innerHTML=this._getContentHTML(o,i.contentId,i.ctaText),this._updateDots(i.cardSelector,t),n.style.opacity="1"},this.config.FADE_DURATION)},_updateDots(e,t){var i;(i=document.querySelector(e))==null||i.querySelectorAll(".dot").forEach((o,n)=>{const r=n===t;o.style.opacity=r?"1":"0.5",o.classList.toggle("active",r)})},async render(){if(this.state.isInitialized){console.warn("UpcomingEvents already initialized");return}const e=document.getElementById("upcomingEventsContainer");if(!e){console.warn("upcomingEventsContainer not found - skipping render");return}try{if(c!=null&&c.ready){const t=await c.getAppSettings("upcoming_events");t&&(["classes0","classes1","sessions0","sessions1"].forEach(i=>{if(t[i]){const[o,n]=[i.slice(0,-1),+i.slice(-1)];this[o][n]={...this[o][n],...t[i]}}}),!t.classes0&&t.classes&&(this.classes[0]={...this.classes[0],...t.classes}),!t.sessions0&&t.sessions&&(this.sessions[0]={...this.sessions[0],...t.sessions}))}e.innerHTML=this.getHTML(),setTimeout(()=>this.initRotation(),100),this.state.isInitialized=!0,this.injectAdminUI()}catch(t){console.error("UpcomingEvents render error:",t)}},injectAdminUI(){var n,r,l;const e=(l=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)==null?void 0:l.is_admin,t=document.getElementById("upcomingAdminBtn");if(t){t.style.display=e?"inline-block":"none";return}if(!e)return;const i=document.querySelector("#upcomingEventsContainer .section-header");if(!i)return;const o=document.createElement("button");o.id="upcomingAdminBtn",o.className="btn btn-primary upcoming-admin-btn",o.type="button",o.setAttribute("aria-label","Update event flyers"),o.onclick=()=>_e.openAdminModal(),o.style.cssText="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;",o.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Update Flyers',i.appendChild(o)},destroy(){clearTimeout(this._staggerTimeout),clearInterval(this.state.classInterval),clearInterval(this.state.sessionInterval),this._staggerTimeout=null,this.state.classInterval=null,this.state.sessionInterval=null,this.state.isInitialized=!1},openAdminModal(){if(document.getElementById("eventsAdminModal"))return;this._adminDraft={classes0:{...this.classes[0]},classes1:{...this.classes[1]},sessions0:{...this.sessions[0]},sessions1:{...this.sessions[1]}},this._adminActiveTab="classes0";const e=document.createElement("div");e.id="eventsAdminModal",e.style.cssText=`position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);
            backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;`,e.innerHTML=this._getAdminModalHTML(),document.body.appendChild(e),document.body.style.overflow="hidden",e.addEventListener("click",t=>{t.target===e&&this.closeAdminModal()}),this._renderAdminTab("classes0")},closeAdminModal(){var e;(e=document.getElementById("eventsAdminModal"))==null||e.remove(),document.body.style.overflow=""},_getAdminModalHTML(){return`
        <div style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:24px;
                    max-width:560px;width:94%;max-height:90vh;overflow-y:auto;position:relative;
                    box-shadow:8px 8px 20px rgba(0,0,0,0.2);">
            <button type="button" onclick="UpcomingEvents.closeAdminModal()"
                    aria-label="Close admin modal"
                    style="position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;">✕</button>
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                        color:var(--neuro-accent);margin-bottom:16px;" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Update Flyers</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
                ${this.config.ADMIN_TABS.map((t,i)=>`
                <button type="button" id="adminTab_${t.id}" onclick="UpcomingEvents._switchAdminTab('${t.id}')" aria-pressed="${i===0}"
                        style="padding:9px;border-radius:10px;border:none;cursor:pointer;font-size:0.82rem;font-weight:600;
                               ${i===0?"background:var(--neuro-accent);color:#fff;":"background:var(--neuro-accent-a10);color:var(--neuro-accent);"}">
                    ${t.label}
                </button>`).join("")}
            </div>
            <div id="adminTabContent"></div>
            <div style="display:flex;gap:10px;margin-top:20px;">
                <button type="button" onclick="UpcomingEvents._adminSave()"
                        style="flex:1;padding:11px;border-radius:12px;border:none;cursor:pointer;
                               font-size:0.92rem;font-weight:700;background:var(--neuro-accent);color:#fff;">
                    Save & Publish
                </button>
                <button type="button" onclick="UpcomingEvents.closeAdminModal()"
                        style="padding:11px 18px;border-radius:12px;border:none;cursor:pointer;
                               font-size:0.92rem;background:rgba(0,0,0,0.06);color:var(--neuro-text);">
                    Cancel
                </button>
            </div>
        </div>`},_switchAdminTab(e){this._readAdminFields(this._adminActiveTab),this._adminActiveTab=e,this.config.ADMIN_TABS.forEach(({id:t})=>{const i=document.getElementById(`adminTab_${t}`);if(!i)return;const o=t===e;i.style.background=o?"var(--neuro-accent)":"var(--neuro-accent-a10)",i.style.color=o?"#fff":"var(--neuro-accent)"}),this._renderAdminTab(e)},_renderAdminTab(e){const t=document.getElementById("adminTabContent");if(!t)return;const i=this._adminDraft[e],{Sessions:o,Workshops:n}=this.config.FLYER_FILES,r=(s,d)=>d.map(u=>{const m=this._flyerBase+s+"/"+u,g=i.image===m;return`<button type="button" onclick="UpcomingEvents._selectFlyer('${e}','${m}','${u}')"
                         style="cursor:pointer;border-radius:8px;overflow:hidden;
                                border:3px solid ${g?"var(--neuro-accent)":"transparent"};
                                transition:border 0.15s;">
                        <img src="${m}" alt="${u}" loading="lazy" decoding="async" style="width:100%;height:auto;display:block;">
                    </button>`}).join(""),l={classes0:"Left Card - Flyer 1",classes1:"Left Card - Flyer 2",sessions0:"Right Card - Flyer 1",sessions1:"Right Card - Flyer 2"},a=`padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                            font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);
                            width:100%;box-sizing:border-box;`;t.innerHTML=`
            <div style="font-size:0.78rem;font-weight:700;color:var(--neuro-accent);margin-bottom:12px;
                        text-transform:uppercase;letter-spacing:0.5px;">Editing: ${l[e]}</div>
            <div style="margin-bottom:14px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:8px;">Sessions</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${r("Sessions",o)}</div>
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:14px 0 8px;">Workshops</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${r("Workshops",n)}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <input id="adminField_title"    placeholder="Title"    value="${this.escapeHtml(i.title||"")}"    style="${a}">
                <input id="adminField_subtitle" placeholder="Subtitle" value="${this.escapeHtml(i.subtitle||"")}" style="${a}">
                <textarea id="adminField_info"  placeholder="Description" rows="3" style="${a}resize:vertical;">${this.escapeHtml(i.info||"")}</textarea>
                <input id="adminField_type"     placeholder="Type (e.g. 🎴 Online Zoom Class)"         value="${this.escapeHtml(i.type||"")}"     style="${a}">
                <input id="adminField_datetime" placeholder="Date & Time (e.g. Monday, 10:00 AM GMT+2)" value="${this.escapeHtml(i.datetime||"")}" style="${a}">
            </div>`},_selectFlyer(e,t,i){const o=this.flyerCatalog[i]||{},n=this._adminDraft[e];this._adminDraft[e]={...n,image:t,title:o.title||n.title,subtitle:o.subtitle||n.subtitle,info:o.info||n.info,type:o.type||n.type},this._renderAdminTab(e)},_readAdminFields(e){if(!document.getElementById("adminField_title"))return;const t=i=>{var o,n;return((n=(o=document.getElementById(i))==null?void 0:o.value)==null?void 0:n.trim())||""};this._adminDraft[e]={...this._adminDraft[e],title:t("adminField_title"),subtitle:t("adminField_subtitle"),info:t("adminField_info"),type:t("adminField_type"),datetime:t("adminField_datetime")}},async _adminSave(){const e=document.querySelector('#eventsAdminModal button[onclick*="_adminSave"]');e&&(e.disabled=!0,e.textContent="Saving..."),this._readAdminFields(this._adminActiveTab);try{const t={classes0:this._adminDraft.classes0,classes1:this._adminDraft.classes1,sessions0:this._adminDraft.sessions0,sessions1:this._adminDraft.sessions1};if(!await c.saveAppSettings("upcoming_events",t))throw new Error("saveAppSettings returned false");["classes0","classes1","sessions0","sessions1"].forEach(o=>{const[n,r]=[o.slice(0,-1),+o.slice(-1)];Object.assign(this[n][r],this._adminDraft[o])}),this.updateCard("classes",this.state.classIndex),this.updateCard("sessions",this.state.sessionIndex),window.Core.showToast("Flyers updated for all users"),this.closeAdminModal()}catch(t){console.error("_adminSave error:",t),window.Core.showToast("Could not save - please try again"),e&&(e.disabled=!1,e.textContent="Save & Publish")}},openWhatsApp(e){e&&window.open(e,"_blank","noopener,noreferrer")},escapeHtml(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}};window.UpcomingEvents=_e;const tt=Object.freeze(Object.defineProperty({__proto__:null,UpcomingEvents:_e},Symbol.toStringTag,{value:"Module"})),ge={state:{isRendered:!1,calmsSentCount:0,lastCalmSentAt:null,isHolding:!1,holdProgress:0,holdInterval:null,HOLD_DURATION_MS:3e3,COOLDOWN_MS:3e4,energyLevel:42,ENERGY_PER_PULSE:5,isContributing:!1,contributeStartedAt:null,timerInterval:null,countedAsParticipant:!1,waveTotalMinutes:967,WAVE_GOAL_MINUTES:1440,userTodayMinutes:0,userAllTimeMinutes:0,communityPulseCount:47,recentSenders:[]},config:{DEFAULT_PRESENCE_COUNT:127,DEFAULT_WAVE_PARTICIPANTS:0},_FIELD_LABELS:[{min:80,text:"The field is radiant",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="19.78" y1="4.22" x2="17.66" y2="6.34"/><line x1="6.34" y1="17.66" x2="4.22" y2="19.78"/></svg>'},{min:60,text:"The field is strong",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M12 8v8"/></svg>'},{min:40,text:"The field is growing",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6"/><path d="M12 12C12 7 17 4 21 6"/></svg>'},{min:20,text:"The field is flickering",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2L8 10h4l-2 10 8-12h-4l2-6z"/></svg>'},{min:0,text:"The field needs energy",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'}],render(){const e=document.getElementById("collectiveFieldContainer");if(!e){console.warn("[CollectiveField] #collectiveFieldContainer not found");return}this._cleanup();try{e.innerHTML=this._buildHTML(),this.state.isRendered=!0,["pulseBtn","waveBtn"].forEach(t=>{const i=document.getElementById(t);i&&(i.addEventListener("contextmenu",o=>o.preventDefault()),i.addEventListener("touchstart",o=>{o.preventDefault(),ge.handleHoldStart()},{passive:!1}))}),this._lastSentRefreshInterval=setInterval(()=>{const t=document.getElementById("lastSentLabel");t&&(t.textContent=this._getLastSentLabel())},6e4),this.state.isContributing&&this._resumeWaveTick()}catch(t){console.error("[CollectiveField] render error:",t)}},_buildHTML(){return`
            <div class="section-header">
                <div class="section-title">Collective Field</div>
            </div>
            <div class="collective-grid">
                ${this._buildEnergyFieldHTML()}
                ${this._buildCalmWaveHTML()}
            </div>`},_buildEnergyFieldHTML(){const{energyLevel:e,communityPulseCount:t}=this.state,i=this._getFieldLabel(e),o=this._getLastSentLabel(),n=this._buildRecentSendersHTML();return`
            <div class="collective-card energy-card">
                <div class="collective-icon">${this._buildEnergyFieldSVG()}</div>
                <div class="collective-title">Community Energy</div>

                <div class="collective-count">
                    <span class="count-number" id="communityPulseCount">${t}</span>
                    <span class="count-label">Pulses Sent Today</span>
                </div>

                <div id="fieldStateLabel" style="font-size:13px;font-weight:600;color:var(--text-muted);margin:6px 0 0;text-align:center;">
                    ${i}
                </div>

                <div style="margin:10px 0;">
                    <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">Recent senders</div>
                    <div id="recentSendersStrip" style="display:flex;gap:4px;align-items:center;min-height:26px;">
                        ${n}
                    </div>
                    <div id="lastSentLabel" style="font-size:11px;color:var(--text-muted);margin-top:5px;">${o}</div>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" id="pulseFill"
                                 style="width:${e}%"
                                 role="progressbar"
                                 aria-valuenow="${e}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats" style="display:flex;align-items:center;">
                        <span class="progress-label">Energy Level</span>
                        <span class="progress-value" id="energyValue">${e}%</span>
                        <span id="adminEnergyBtn" style="display:none;margin-left:8px;">
                            <button type="button" class="btn btn-primary" onclick="CollectiveField.adminAddEnergy()" title="Admin: Add Energy"
                                    style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;padding:4px 10px;font-size:12px;min-height:unset;border-radius:99px;">+</button>
                        </span>
                    </div>
                </div>

                <button type="button" class="collective-action-btn" id="pulseBtn"
                        onmousedown="CollectiveField.handleHoldStart()"
                        onmouseup="CollectiveField.handleHoldEnd()"
                        ontouchend="CollectiveField.handleHoldEnd()"
                        onmouseleave="CollectiveField.handleHoldCancel()"
                        aria-label="Hold to send energy to the community">
                    <svg class="hold-ring" viewBox="0 0 36 36" aria-hidden="true">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
                        <circle id="holdRing" cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-dasharray="100.5" stroke-dashoffset="100.5"
                                stroke-linecap="round" transform="rotate(-90 18 18)"/>
                    </svg>
                    <span id="pulseBtnLabel">Hold to Send Energy</span>
                </button>
            </div>`},_buildCalmWaveHTML(){const{waveTotalMinutes:e,WAVE_GOAL_MINUTES:t,userTodayMinutes:i,userAllTimeMinutes:o}=this.state,n=this.config.DEFAULT_WAVE_PARTICIPANTS,r=Math.min(Math.round(e/t*100),100),l=Math.max(t-e,0),a=Math.floor(l/60),s=l%60,d=a>0?`${a}h ${s}m`:`${s}m`;return`
            <div class="collective-card wave-card-new">
                <div class="collective-icon" style="position:relative;">
                    ${this._buildCalmWaveSVG()}
                    <div id="waveRippleStage" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>
                </div>

                <div class="collective-title">24h Calm Wave</div>

                <div class="collective-count">
                    <span class="count-number" id="waveParticipants">${n}</span>
                    <span class="count-label">Participants</span>
                </div>

                <div class="wave-time-block" style="position:relative;">
                    <!-- Session count-up clock (hidden idle, expands when active) -->
                    <div id="waveSessionClock" style="overflow:hidden;max-height:0;opacity:0;transition:max-height 0.5s ease,opacity 0.4s ease,margin 0.4s ease;margin-bottom:0;">
                        <div id="waveCountUp" style="font-size:32px;font-weight:700;letter-spacing:2px;color:var(--text-primary);line-height:1;" aria-live="polite">00:00</div>
                        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">your silence so far</div>
                    </div>

                    <!-- Collective time remaining -->
                    <div id="waveCollectiveTime" style="transition:font-size 0.4s ease,opacity 0.4s ease,margin 0.4s ease;">
                        <div id="waveClockDisplay" style="font-size:28px;font-weight:700;letter-spacing:1px;color:var(--text-primary);line-height:1.1;">${d}</div>
                        <div id="waveClockLabel"   style="font-size:11px;color:var(--text-muted);margin-top:2px;">to complete the wave</div>
                        <div id="waveMidnightLabel" style="font-size:10px;color:var(--text-muted);margin-top:1px;opacity:0.7;">resets at midnight UTC</div>
                    </div>

                    <!-- Personal contribution -->
                    <div id="waveContribBlock" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-subtle,rgba(0,0,0,0.08));transition:opacity 0.4s ease;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:3px;">Your contribution</div>
                        <div style="display:flex;gap:12px;align-items:baseline;">
                            <span>
                                <span id="userTodayDisplay"   style="font-size:16px;font-weight:600;color:var(--text-primary);">${i}m</span>
                                <span style="font-size:10px;color:var(--text-muted);margin-left:2px;">today</span>
                            </span>
                            <span>
                                <span id="userAllTimeDisplay" style="font-size:16px;font-weight:600;color:var(--text-primary);">${o}m</span>
                                <span style="font-size:10px;color:var(--text-muted);margin-left:2px;">all time</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" id="waveFill"
                                 style="width:${r}%"
                                 role="progressbar"
                                 aria-valuenow="${r}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats" style="display:flex;align-items:center;">
                        <span class="progress-label">Wave Building</span>
                        <span class="progress-value" id="waveProgressValue">${r}%</span>
                        <span id="adminWaveBtn" style="display:none;margin-left:8px;">
                            <button type="button" class="btn btn-primary" onclick="CollectiveField.adminAddWaveMinutes()" title="Admin: Add 60 minutes to Wave"
                                    style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;padding:4px 10px;font-size:12px;min-height:unset;border-radius:99px;">+</button>
                        </span>
                    </div>
                </div>

                <button type="button" class="collective-action-btn" id="waveBtn"
                        onclick="CollectiveField.handleContributeWave()"
                        aria-label="Contribute silence to the calm wave">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        <path d="M12 6v12M6 12h12"/>
                    </svg>
                    <span id="waveBtnLabel">Start Silence</span>
                </button>
            </div>`},_buildEnergyFieldSVG(){return`
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                <circle cx="50" cy="50" r="15" stroke="currentColor" stroke-width="2" opacity="0.7"/>
                <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.9">
                    <animate attributeName="r"       values="8;12;8"       dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.9;0.6;0.9"  dur="3s" repeatCount="indefinite"/>
                </circle>
            </svg>`},_buildCalmWaveSVG(){return`
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10 50 Q 20 30, 30 50 T 50 50 T 70 50 T 90 50" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.4"/>
                <path d="M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.6"/>
                <path d="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50" stroke="currentColor" stroke-width="3"   fill="none">
                    <animate attributeName="d"
                        values="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50"
                        dur="4s" repeatCount="indefinite"/>
                </path>
            </svg>`},_cleanup(){const e=this.state,t=["holdInterval","timerInterval"];for(const i of t)e[i]&&(clearInterval(e[i]),e[i]=null);this._lastSentRefreshInterval&&(clearInterval(this._lastSentRefreshInterval),this._lastSentRefreshInterval=null),e.isHolding=!1},handleHoldStart(){var i;const e=this.state;if(e.lastCalmSentAt&&Date.now()-e.lastCalmSentAt<e.COOLDOWN_MS){const o=Math.ceil((e.COOLDOWN_MS-(Date.now()-e.lastCalmSentAt))/1e3);this._toast(`Wait ${o}s before sending again`);return}if(e.isHolding)return;e.isHolding=!0,e.holdProgress=0,(i=document.getElementById("pulseBtn"))==null||i.classList.add("holding");const t=Date.now();e.holdInterval=setInterval(()=>{const o=Date.now()-t;e.holdProgress=Math.min(o/e.HOLD_DURATION_MS*100,100);const n=document.getElementById("holdRing");n&&(n.style.strokeDashoffset=100.5-e.holdProgress/100*100.5),e.holdProgress>=100&&(clearInterval(e.holdInterval),e.holdInterval=null,e.isHolding=!1,this._firePulse())},50)},handleHoldEnd(){this.state.isHolding&&this._cancelHold()},handleHoldCancel(){this.state.isHolding&&this._cancelHold()},_cancelHold(){var i;const e=this.state;e.holdInterval&&(clearInterval(e.holdInterval),e.holdInterval=null),e.isHolding=!1,e.holdProgress=0,(i=document.getElementById("pulseBtn"))==null||i.classList.remove("holding");const t=document.getElementById("holdRing");t&&(t.style.strokeDashoffset="100.5")},_firePulse(){const e=this.state;e.lastCalmSentAt=Date.now(),e.calmsSentCount++;const t=document.getElementById("pulseBtn");t&&(t.classList.remove("holding"),t.classList.add("fired"),setTimeout(()=>t.classList.remove("fired"),1e3));const i=document.getElementById("holdRing");i&&(i.style.strokeDashoffset="100.5"),this._addEnergy(e.ENERGY_PER_PULSE),this._triggerFieldRipple(e.calmsSentCount),this._triggerAppWideRipple(),this._broadcastPulse(e.calmsSentCount),e.communityPulseCount++,this._addSelfToRecentSenders(),this._refreshEnergyCardMeta(),this._toast("Energy sent")},_addEnergy(e){const t=this.state;t.energyLevel=Math.min(t.energyLevel+e,100),this._updateEnergyBar(t.energyLevel)},_updateEnergyBar(e){var n,r,l;const t=document.getElementById("pulseFill"),i=document.getElementById("energyValue");t&&(t.style.width=`${e}%`,t.setAttribute("aria-valuenow",e)),i&&(i.textContent=`${e}%`);const o=document.getElementById("adminEnergyBtn");o&&(o.style.display=(l=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)!=null&&l.is_admin?"inline":"none")},handleContributeWave(){this.state.isContributing?this._endWave().catch(e=>console.error("[CollectiveField] _endWave error:",e)):this._startWave()},_startWave(){var i;const e=this.state;e.isContributing=!0,e.contributeStartedAt=Date.now(),e.countedAsParticipant=!1,(i=document.getElementById("waveBtn"))==null||i.classList.add("in-progress");const t=document.getElementById("waveBtnLabel");t&&(t.textContent="End Session"),this._updateWaveStatusLine(),this._toast("Silence started"),e.timerInterval=setInterval(()=>this._waveTick(),1e3)},_resumeWaveTick(){var i;const e=this.state;(i=document.getElementById("waveBtn"))==null||i.classList.add("in-progress");const t=document.getElementById("waveBtnLabel");t&&(t.textContent="End Session"),this._updateWaveStatusLine(),e.timerInterval=setInterval(()=>this._waveTick(),1e3)},_waveTick(){const e=this.state;if(!e.isContributing)return;const t=Date.now()-e.contributeStartedAt;!e.countedAsParticipant&&t>=300*1e3&&(e.countedAsParticipant=!0,this._incrementParticipantCount(),this._triggerAvatarRipple(),this._toast("You're in the wave")),this._updateWaveStatusLine(t)},async _endWave(){var a;const e=this.state;clearInterval(e.timerInterval),e.timerInterval=null,e.isContributing=!1;const t=Date.now()-e.contributeStartedAt,i=Math.floor(t/6e4);e.countedAsParticipant&&(this._decrementParticipantCount(),e.countedAsParticipant=!1),(a=document.getElementById("waveBtn"))==null||a.classList.remove("in-progress");const o=document.getElementById("waveBtnLabel");if(o&&(o.textContent="Start Silence"),i<1){this._toast("Sit a little longer"),this._updateWaveStatusLine();return}const n=e.waveTotalMinutes,r=e.userTodayMinutes,l=e.userAllTimeMinutes;e.waveTotalMinutes=Math.min(e.waveTotalMinutes+i,e.WAVE_GOAL_MINUTES),e.userTodayMinutes+=i,e.userAllTimeMinutes+=i,this._updateWaveProgress(),this._updateWaveStatusLine(),this._toast(`${i}min contributed to the wave`),e.waveTotalMinutes>=e.WAVE_GOAL_MINUTES&&this._onWaveComplete();try{await Q.logWaveContribution(i,!0)}catch(s){console.error("[CollectiveField] logWaveContribution failed — rolling back:",s),e.waveTotalMinutes=n,e.userTodayMinutes=r,e.userAllTimeMinutes=l,this._updateWaveProgress(),this._updateWaveStatusLine(),this._toast("Could not save session — please try again")}},_onWaveComplete(){this._toast("The wave is complete! A new one begins tomorrow.")},_updateWaveProgress(){var r,l,a;const e=this.state,t=Math.min(Math.round(e.waveTotalMinutes/e.WAVE_GOAL_MINUTES*100),100),i=document.getElementById("waveFill"),o=document.getElementById("waveProgressValue");i&&(i.style.width=`${t}%`,i.setAttribute("aria-valuenow",t)),o&&(o.textContent=`${t}%`);const n=document.getElementById("adminWaveBtn");n&&(n.style.display=(a=(l=(r=window.Core)==null?void 0:r.state)==null?void 0:l.currentUser)!=null&&a.is_admin?"inline":"none")},_updateWaveStatusLine(e){const t=this.state,i=document.getElementById("waveSessionClock"),o=document.getElementById("waveCountUp"),n=document.getElementById("waveCollectiveTime"),r=document.getElementById("waveClockDisplay"),l=document.getElementById("waveContribBlock");if(!r)return;const a=Math.max(t.WAVE_GOAL_MINUTES-t.waveTotalMinutes,0),s=Math.floor(a/60),d=a%60;if(r.textContent=s>0?`${s}h ${d}m`:`${d}m`,e!==void 0&&t.isContributing){const u=Math.floor(e/6e4),m=Math.floor(e%6e4/1e3);o&&(o.textContent=`${String(u).padStart(2,"0")}:${String(m).padStart(2,"0")}`),i&&(i.style.maxHeight="60px",i.style.opacity="1",i.style.marginBottom="8px"),n&&(n.style.fontSize="13px",n.style.opacity="0.45",n.style.marginTop="2px"),l&&(l.style.opacity="0.5")}else{i&&(i.style.maxHeight="0",i.style.opacity="0",i.style.marginBottom="0"),n&&(n.style.fontSize="",n.style.opacity="1",n.style.marginTop=""),l&&(l.style.opacity="1");const u=document.getElementById("userTodayDisplay"),m=document.getElementById("userAllTimeDisplay");u&&(u.textContent=`${t.userTodayMinutes}m`),m&&(m.textContent=`${t.userAllTimeMinutes}m`)}},_triggerFieldRipple(e){const t=document.querySelector(".energy-card svg");if(!t)return;const i=Math.max(1-(e-1)*.2,.2),o=document.createElementNS("http://www.w3.org/2000/svg","circle");Object.entries({cx:"50",cy:"50",r:"10",fill:"none",stroke:"currentColor","stroke-width":"2"}).forEach(([n,r])=>o.setAttribute(n,r)),o.style.cssText=`opacity:${i};transition:r 1s ease-out,opacity 1s ease-out;`,t.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>{o.style.opacity="0",o.setAttribute("r","48")})),setTimeout(()=>o.remove(),1100)},_triggerAppWideRipple(){if(!document.getElementById("appRippleStyles")){const l=document.createElement("style");l.id="appRippleStyles",l.textContent=`
                @keyframes waterRipple  { 0%{width:0;height:0;opacity:0.8;box-shadow:0 0 0 0 rgba(90,180,160,0.3)} 30%{opacity:0.6;box-shadow:0 0 24px 8px rgba(90,180,160,0.15)} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0;box-shadow:0 0 0 0 rgba(90,180,160,0)} }
                @keyframes waterRipple2 { 0%{width:0;height:0;opacity:0} 15%{opacity:0.5} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0} }
                @keyframes waterRipple3 { 0%{width:0;height:0;opacity:0} 25%{opacity:0.3} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0} }
                #appRippleOverlay { position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:visible; }
                .app-wide-ripple  { position:absolute;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);will-change:width,height,opacity; }
                .app-wide-ripple.ring-1 { border:4px solid rgba(90,180,160,0.85);background:rgba(90,180,160,0.06);animation:waterRipple  2.6s cubic-bezier(0.1,0.4,0.3,1) forwards; }
                .app-wide-ripple.ring-2 { border:2.5px solid rgba(90,180,160,0.5);background:transparent;animation:waterRipple2 2.6s cubic-bezier(0.1,0.4,0.3,1) 0.3s forwards; }
                .app-wide-ripple.ring-3 { border:1.5px solid rgba(90,180,160,0.3);background:transparent;animation:waterRipple3 2.6s cubic-bezier(0.1,0.4,0.3,1) 0.6s forwards; }
            `,document.head.appendChild(l)}let e=document.getElementById("appRippleOverlay");e||(e=document.createElement("div"),e.id="appRippleOverlay",document.body.appendChild(e));const t=document.querySelector(".energy-card"),i=t?t.getBoundingClientRect():null,o=i?i.left+i.width/2:window.innerWidth/2,n=i?i.top+i.height/2:window.innerHeight/2,r=Math.hypot(window.innerWidth,window.innerHeight)*2.2;["ring-1","ring-2","ring-3"].forEach((l,a)=>{const s=document.createElement("div");s.className=`app-wide-ripple ${l}`,s.style.cssText=`--ripple-size:${r}px;left:${o}px;top:${n}px;`,e.appendChild(s),setTimeout(()=>s.remove(),3400+a*300)})},_triggerAvatarRipple(){var l,a;if(!document.getElementById("waveRippleStyles")){const s=document.createElement("style");s.id="waveRippleStyles",s.textContent=`
                @keyframes waveFloat {
                    0%   { transform:translateY(0) scale(1);    opacity:0; }
                    15%  { opacity:1; }
                    80%  { opacity:0.9; }
                    100% { transform:translateY(-90px) scale(0.7); opacity:0; }
                }
                .wave-avatar-ripple {
                    position:absolute;bottom:10px;width:32px;height:32px;border-radius:50%;
                    object-fit:cover;animation:waveFloat 2.8s ease-out forwards;
                    pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,0.15);
                    border:2px solid rgba(255,255,255,0.6);font-size:20px;
                    display:flex;align-items:center;justify-content:center;
                    background:var(--bg-card,#f0ece6);
                }
            `,document.head.appendChild(s)}const e=document.getElementById("waveRippleStage");if(!e)return;const t=(a=(l=window.Core)==null?void 0:l.state)==null?void 0:a.currentUser,i=(t==null?void 0:t.avatar_url)||null,o=(t==null?void 0:t.emoji)||"🧘",n=Math.floor(Math.random()*((e.offsetWidth||80)-36))+2;let r;i?(r=Object.assign(document.createElement("img"),{src:i,alt:"You",className:"wave-avatar-ripple"}),r.onerror=()=>r.replaceWith(this._makeEmojiRipple(o,n))):r=this._makeEmojiRipple(o,n),r.style.left=`${n}px`,e.appendChild(r),setTimeout(()=>r.remove(),3e3)},_makeEmojiRipple(e,t){const i=document.createElement("span");return i.textContent=e,i.className="wave-avatar-ripple",i.style.cssText=`left:${t}px;line-height:28px;text-align:center;`,i},_incrementParticipantCount(){const e=document.getElementById("waveParticipants");e&&(e.textContent=parseInt(e.textContent||"0")+1)},_decrementParticipantCount(){const e=document.getElementById("waveParticipants");e&&(e.textContent=Math.max(parseInt(e.textContent||"0")-1,0))},_broadcastPulse(e){Q==null||Q.recordPulse().catch(t=>console.error("[CollectiveField] recordPulse failed:",t))},receiveExternalPulse(e){const t=Math.min(e.intensity||.6,.8);this._triggerFieldRipple(Math.round((1-t)/.2)+1)},_refreshEnergyCardMeta(){const e=this.state,t=document.getElementById("fieldStateLabel"),i=document.getElementById("lastSentLabel"),o=document.getElementById("communityPulseCount"),n=document.getElementById("recentSendersStrip");t&&(t.innerHTML=this._getFieldLabel(e.energyLevel)),i&&(i.textContent=this._getLastSentLabel()),o&&(o.textContent=e.communityPulseCount),n&&(n.innerHTML=this._buildRecentSendersHTML())},_addSelfToRecentSenders(){var t,i;const e=(i=(t=window.Core)==null?void 0:t.state)==null?void 0:i.currentUser;this.state.recentSenders=[{emoji:(e==null?void 0:e.emoji)||"🧘",avatarUrl:(e==null?void 0:e.avatar_url)||null},...this.state.recentSenders].slice(0,5)},_getFieldLabel(e){const{text:t,svg:i}=this._FIELD_LABELS.find(o=>e>=o.min)||this._FIELD_LABELS.at(-1);return`<span style="display:inline-flex;align-items:center;gap:5px;opacity:0.75;">${i}<span>${t}</span></span>`},_getLastSentLabel(){const e=this.state.lastCalmSentAt;if(!e)return"Not sent yet";const t=Math.floor((Date.now()-e)/1e3);if(t<60)return`Sent ${t}s ago`;const i=Math.floor(t/60);return i<60?`Sent ${i}m ago`:`Sent ${Math.floor(i/60)}h ago`},_buildRecentSendersHTML(){const e=this.state.recentSenders;return e.length?e.slice(0,5).map(t=>t.avatarUrl?`<img src="${t.avatarUrl}" alt="" width="26" height="26" loading="lazy" decoding="async"
                             style="width:26px;height:26px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border-subtle,rgba(0,0,0,0.1));"
                             onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${t.emoji||"🧘"}',style:'font-size:20px;line-height:26px;'}))">`:`<span style="font-size:20px;line-height:26px;" title="Recent sender">${t.emoji||"🧘"}</span>`).join(""):'<span style="font-size:11px;color:var(--text-muted);font-style:italic;">No one yet - be first</span>'},updatePresenceCount(e){if(typeof e!="number"||e<0)return;const t=document.getElementById("presenceCount");t&&(t.textContent=e)},updateEnergyLevel(e){typeof e!="number"||e<0||e>100||(this.state.energyLevel=e,this._updateEnergyBar(e))},updateCommunityPulseCount(e){this.state.communityPulseCount=e||0;const t=document.getElementById("communityPulseCount");t&&(t.textContent=this.state.communityPulseCount)},updateRecentSenders(e){this.state.recentSenders=e||[];const t=document.getElementById("recentSendersStrip");t&&(t.innerHTML=this._buildRecentSendersHTML())},updateUserContribution(e,t){this.state.userTodayMinutes=e||0,this.state.userAllTimeMinutes=t||0,this.state.isContributing||this._updateWaveStatusLine()},updateWaveParticipants(e){this.config.DEFAULT_WAVE_PARTICIPANTS=e||0;const t=document.getElementById("waveParticipants");t&&(t.textContent=e||0)},updateWaveTotalMinutes(e){typeof e!="number"||e<0||(this.state.waveTotalMinutes=Math.min(e,this.state.WAVE_GOAL_MINUTES),this._updateWaveProgress(),this.state.isContributing||this._updateWaveStatusLine())},refresh(){try{this.render()}catch(e){console.error("[CollectiveField] refresh error:",e)}},injectAdminUI(){var o,n,r;const e=(r=(n=(o=window.Core)==null?void 0:o.state)==null?void 0:n.currentUser)==null?void 0:r.is_admin,t=document.getElementById("adminEnergyBtn"),i=document.getElementById("adminWaveBtn");t&&(t.style.display=e?"inline":"none"),i&&(i.style.display=e?"inline":"none")},async adminAddEnergy(){var e,t,i;if((i=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)!=null&&i.is_admin)try{const o=window.AppSupabase||window.CommunitySupabase;if(!o)throw new TypeError("Supabase client unavailable");const{error:n}=await o.rpc("increment_field_pulse",{p_date:new Date().toISOString().slice(0,10),p_energy_add:10});if(n)throw n;await window.CollectiveFieldDB.loadFieldState(),this._toast("+10 Energy added")}catch(o){console.error("[CollectiveField] adminAddEnergy error:",o),this._toast("Could not add energy")}},async adminAddWaveMinutes(){var e,t,i;if((i=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)!=null&&i.is_admin)try{await window.CollectiveFieldDB.logWaveContribution(60,!1),this._toast("+60 min added to Wave")}catch(o){console.error("[CollectiveField] adminAddWaveMinutes error:",o),this._toast("Could not add wave minutes")}},_toast(e){var t;(t=window.Core)==null||t.showToast(e)}};window.addEventListener("beforeunload",()=>ge._cleanup());window.CollectiveField=ge;const it=Object.freeze(Object.defineProperty({__proto__:null,CollectiveField:ge},Symbol.toStringTag,{value:"Module"})),B=()=>window.CommunityDB,$e={state:{currentView:"public",isInitialized:!1},config:{MAX_INSPIRATION_LENGTH:200,PULSE_ANIMATION_DURATION:600,LEVEL_TITLES:{1:"Seeker",2:"Practitioner",3:"Adept",4:"Healer",5:"Master",6:"Sage",7:"Enlightened",8:"Buddha",9:"Light",10:"Emptiness"},RARITY_COLORS:{common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"},RARITY_LABELS:{common:"Common",uncommon:"Uncommon",rare:"Rare",epic:"Epic",legendary:"Legendary"},STATUS_RING:{online:{color:"var(--ring-available, #6b9b37)",label:"Available"},available:{color:"var(--ring-available, #6b9b37)",label:"Available"},away:{color:"var(--ring-guiding,   #e53e3e)",label:"Away"},guiding:{color:"var(--ring-guiding,   #e53e3e)",label:"Away"},silent:{color:"var(--ring-silent,    #7c3aed)",label:"In Silence"},deep:{color:"var(--ring-deep,      #1e40af)",label:"Deep Practice"},offline:{color:"var(--ring-offline,   #9ca3af)",label:"Offline"}},STATUS_ACTIVITIES:{online:"✨ Available",away:"🌿 Away",silent:"🤫 In Silence",deep:"🧘 Deep Practice",offline:"💤 Offline"},COUNTRY_CODES:{israel:"IL","united states":"US",usa:"US",us:"US","united kingdom":"GB",uk:"GB",canada:"CA",australia:"AU",germany:"DE",france:"FR",spain:"ES",italy:"IT",netherlands:"NL",belgium:"BE",switzerland:"CH",sweden:"SE",norway:"NO",denmark:"DK",finland:"FI",poland:"PL",portugal:"PT",austria:"AT",india:"IN",china:"CN",japan:"JP","south korea":"KR",brazil:"BR",mexico:"MX",argentina:"AR","south africa":"ZA",russia:"RU",ukraine:"UA",greece:"GR",turkey:"TR",egypt:"EG","new zealand":"NZ",ireland:"IE",singapore:"SG",thailand:"TH",indonesia:"ID",malaysia:"MY",philippines:"PH"}},_user(){var e,t;return((t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)??null},_esc(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML},_formatEntryDate(e){if(!e)return"";try{return new Date(e).toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric",year:"numeric"})}catch{return String(e)}},_countryFlag(e){const t=this.config.COUNTRY_CODES[e.toLowerCase().trim()];return t?[...t].map(i=>String.fromCodePoint(127462+i.charCodeAt(0)-65)).join(""):"🌍"},formatMinutes(e,t){const i=typeof e=="number"&&e>=0?e:0,o=Math.floor(i/60),n=i%60,r=o===0?`${n} minutes`:n===0?`${o} ${o===1?"hour":"hours"}`:`${o}h ${n}m`;return t&&(t.textContent=r),r},init(){if(this.state.isInitialized){console.warn("ProfileModule already initialized");return}try{this.renderHTML(),this.populateData(),this.setupCharCounter(),this.state.isInitialized=!0,window.addEventListener("statusChanged",e=>{const{status:t}=e.detail||{};if(!t)return;const i=this._user();i&&(i.status=t,i.community_status=t),this.updateStatusRing(t);const o=document.getElementById("statusPickerDot"),n=document.getElementById("statusPickerLabel"),r=this.config.STATUS_RING[t]||this.config.STATUS_RING.offline;o&&(o.style.background=r.color),n&&(n.textContent=r.label)})}catch(e){console.error("ProfileModule initialization failed:",e)}},getHTML(){const e=[{status:"online",label:"Available",color:"var(--ring-available,#6b9b37)",icon:"🟢"},{status:"away",label:"Away",color:"var(--ring-guiding,#e53e3e)",icon:"🔴"},{status:"silent",label:"In Silence",color:"var(--ring-silent,#7c3aed)",icon:"🟣"},{status:"deep",label:"Deep Practice",color:"var(--ring-deep,#1e40af)",icon:"🔵"},{status:"offline",label:"Offline",color:"var(--ring-offline,#9ca3af)",icon:"⚫"}],t=[{type:"journal",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',label:"Journal",count:"entries"},{type:"gratitude",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3-2 2-1-1"/></svg>',label:"Gratitude",count:"entries"},{type:"energy",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',label:"Energy",count:"check-ins"},{type:"flip",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',label:"Flip the Script",count:"entries"},{type:"tarot",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="5" width="11" height="14" rx="2"/><path d="M15.5 5.5 18 3l4 4-5.5 5.5"/><path d="m13 13 4.5 4.5"/><path d="m17.5 17.5 1 1"/></svg>',label:"Tarot Spreads",count:"readings"},{type:"meditation",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',label:"Meditations",count:"sessions"}],i=`background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
            cursor:pointer;text-align:center;
            box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
            transition:transform 0.15s,box-shadow 0.15s;`;return`
        <!-- ── Profile Hero ───────────────────────────────────────── -->
        <header class="profile-hero" style="border-radius:20px 20px 0 0;overflow:hidden;">
            <div class="profile-container">
                <div class="profile-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-wrap" style="position:relative;width:fit-content;">
                            <div class="profile-avatar" id="profileAvatar" aria-label="Profile avatar">
                                <img id="profileAvatarImg" width="80" height="80" loading="lazy" decoding="async"
                                     style="display:none;width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                                     alt="Profile photo">
                                <span id="profileAvatarFallback">?</span>
                            </div>
                            <div class="profile-status-ring" id="statusRing" aria-hidden="true"></div>
                            <button class="edit-avatar"
                                    onclick="ProfileModule.editProfile()"
                                    aria-label="Edit profile"
                                    style="position:absolute;bottom:2px;right:2px;
                                           width:26px;height:26px;border-radius:50%;border:none;
                                           background:var(--neuro-bg,#f0f0f3);
                                           box-shadow:2px 2px 6px rgba(0,0,0,0.15),-1px -1px 4px rgba(255,255,255,0.7);
                                           cursor:pointer;font-size:13px;
                                           display:flex;align-items:center;justify-content:center;
                                           transition:transform 0.15s;z-index:2;"
                                    onmouseover="this.style.transform='scale(1.15)'"
                                    onmouseout="this.style.transform='scale(1)'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></button>
                        </div>

                        <!-- Status picker -->
                        <div style="position:relative;">
                            <button id="statusPickerBtn"
                                    onclick="ProfileModule.toggleStatusPicker()"
                                    style="display:flex;align-items:center;gap:6px;
                                           padding:5px 12px;border-radius:99px;border:none;
                                           cursor:pointer;font-size:0.78rem;font-weight:600;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                                           box-shadow:2px 2px 6px rgba(0,0,0,0.1),-1px -1px 4px rgba(255,255,255,0.7);
                                           transition:box-shadow 0.15s;">
                                <span id="statusPickerDot"
                                      style="width:9px;height:9px;border-radius:50%;
                                             background:var(--ring-available,#6b9b37);flex-shrink:0;"></span>
                                <span id="statusPickerLabel">Available</span>
                                <span style="opacity:0.5;font-size:10px;">▼</span>
                            </button>

                            <div id="statusPickerDropdown"
                                 style="display:none;position:absolute;top:calc(100% + 8px);left:50%;
                                        transform:translateX(-50%);
                                        background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:6px;
                                        box-shadow:6px 6px 16px rgba(0,0,0,0.15),-3px -3px 10px rgba(255,255,255,0.7);
                                        z-index:999;min-width:170px;">
                                ${e.map(o=>`
                                <button onclick="ProfileModule.setStatus('${o.status}','${o.label}','${o.color}')"
                                        style="display:flex;align-items:center;gap:10px;width:100%;
                                               padding:8px 10px;border:none;border-radius:10px;
                                               background:none;cursor:pointer;font-size:0.82rem;
                                               color:var(--neuro-text);text-align:left;transition:background 0.15s;"
                                        onmouseover="this.style.background='rgba(0,0,0,0.05)'"
                                        onmouseout="this.style.background='none'">
                                    <span style="width:10px;height:10px;border-radius:50%;background:${o.color};flex-shrink:0;"></span>
                                    ${o.label}
                                </button>`).join("")}
                            </div>
                        </div>
                    </div>

                    <div class="profile-info">
                        <div class="profile-name-row">
                            <div class="profile-name" id="profileName">Loading...</div>
                        </div>

                        <!-- Role · Birthday · Country meta row -->
                        <div id="profileMetaRow"
                             style="display:inline-flex;align-items:center;gap:0;
                                    margin:0.4rem 0 0.75rem;
                                    background:var(--neuro-bg,#f0f0f3);
                                    border-radius:99px;
                                    box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                    overflow:hidden;max-width:100%;">

                            <!-- Role -->
                            <div id="profileRoleBadge"
                                 style="display:flex;align-items:center;gap:5px;
                                        font-size:0.76rem;font-weight:700;
                                        color:var(--neuro-accent);
                                        padding:5px 12px;white-space:nowrap;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Member
                            </div>

                            <!-- Separator -->
                            <span class="profile-meta-sep"
                                  style="width:1px;height:16px;
                                         background:rgba(0,0,0,0.1);
                                         flex-shrink:0;"></span>

                            <!-- Birthday -->
                            <span id="profileBirthdayDisplay"
                                  style="font-size:0.76rem;font-weight:600;
                                         color:var(--text-muted);
                                         padding:5px 12px;white-space:nowrap;"></span>

                            <!-- Country separator (hidden if no country) -->
                            <span id="profileCountrySep"
                                  style="width:1px;height:16px;
                                         background:rgba(0,0,0,0.1);
                                         flex-shrink:0;display:none;"></span>

                            <!-- Country -->
                            <span id="profileCountryDisplay"
                                  style="font-size:0.76rem;font-weight:600;
                                         color:var(--text-muted);
                                         padding:5px 12px;white-space:nowrap;"></span>
                        </div>

                        <div class="profile-inspiration">
                            <span id="profileInspiration">"Here to practice with intention."</span>
                            <button class="edit-inspiration-btn" onclick="ProfileModule.editInspiration()" aria-label="Edit inspiration"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                        </div>

                        <!-- ── Gamification Section ───────────────── -->
                        ${this._getGamificationHTML()}

                        <div class="view-toggle">
                            <button class="v-btn active" onclick="ProfileModule.toggleProfileView('public')" aria-pressed="true">Public View</button>
                            <button class="v-btn" onclick="ProfileModule.toggleProfileView('private')" aria-pressed="false">My Activity</button>
                        </div>

                        <div class="private-details" id="privateDetails">
                            <div id="myActivityGrid"
                                 style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">
                                ${t.map(o=>`
                                <div class="activity-card" onclick="ProfileModule.openActivityModal('${o.type}')" style="${i}">
                                    <div style="font-size:1.6rem;margin-bottom:6px;">${o.icon}</div>
                                    <div style="font-weight:700;font-size:0.88rem;color:var(--neuro-text);">${o.label}</div>
                                    <div id="activityCount_${o.type}"
                                         style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">- ${o.count}</div>
                                </div>`).join("")}
                            </div>
                        </div>

                        <!-- ── Divider line ───────────────────────── -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,0,0,0.1),transparent);margin-top:1rem;"></div>

                        <!-- Activity Modal -->
                        <div id="activityModal"
                             style="display:none;position:fixed;inset:0;z-index:9999;
                                    background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                                    align-items:center;justify-content:center;
                                    opacity:0;transition:opacity 0.25s ease;">
                            <div id="activityModalInner"
                                 style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:1.5rem;
                                        max-width:480px;width:92%;max-height:80vh;
                                        position:relative;display:flex;flex-direction:column;
                                        box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                                        transform:translateY(16px);transition:transform 0.25s ease;">
                                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                                    <div id="activityModalTitle" style="font-size:1.1rem;font-weight:700;color:var(--neuro-text);"></div>
                                    <button onclick="ProfileModule.closeActivityModal()"
                                            style="background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;">✕</button>
                                </div>
                                <div id="activityModalBody" style="overflow-y:auto;flex:1;padding-right:4px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>`},_getGamificationHTML(){var l,a,s,d,u,m;const e=(l=window.app)==null?void 0:l.gamification,t=((a=e==null?void 0:e.getStatusSummary)==null?void 0:a.call(e))??{xp:0,karma:0,badges:[]},i=((s=e==null?void 0:e.calculateLevel)==null?void 0:s.call(e))??{level:1,title:"Seeker",progress:0,pointsToNext:100};(m=(u=(d=window.app)==null?void 0:d.state)==null?void 0:u.getStats)==null||m.call(u);const o=i.title.match(/^[aeiou]/i)?"an":"a",n=Math.min(100,Math.max(0,i.progress??0)),r=[{value:t.karma,label:"Karma",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>',id:"statKarma"},{value:"…",label:"Blessings",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',id:"statBlessings"},{value:"-",label:"Fav Room",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',id:"statFavRoom"},{value:(t.badges||[]).length,label:"Badges",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',id:"statBadges"}];return`
        <div class="profile-gamification-section"
             style="padding:1.25rem 1.5rem 1.75rem;background:var(--neuro-bg,#f0f0f3);
                    border-radius:20px;margin-bottom:0.75rem;
                    box-shadow:4px 4px 12px rgba(0,0,0,0.08),-2px -2px 8px rgba(255,255,255,0.7);">

            <!-- Level title + XP bar -->
            <div style="text-align:center;margin-bottom:0.75rem;">
                <div style="font-size:1.25rem;font-weight:700;color:var(--neuro-text);margin-bottom:0.5rem;">
                    <strong style="color:var(--neuro-accent);">${o.charAt(0).toUpperCase()+o.slice(1)} ${i.title}</strong>
                    - Level ${i.level}
                </div>
                <!-- XP progress bar -->
                <div style="height:10px;border-radius:99px;
                            background:rgba(0,0,0,0.07);
                            box-shadow:inset 1px 1px 4px rgba(0,0,0,0.1);
                            overflow:hidden;margin-bottom:0.4rem;">
                    <div id="profileGamificationXpBar"
                         class="profile-xp-bar-fill"
                         data-width="${n}"
                         style="width:0%;height:100%;border-radius:99px;
                                background:linear-gradient(90deg,var(--neuro-accent),var(--neuro-accent,#a855f7));
                                transition:width 0.9s cubic-bezier(0.4,0,0.2,1);
                                position:relative;overflow:hidden;">
                        <div style="position:absolute;inset:0;
                                    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%);
                                    animation:profile-xp-shimmer 2.4s infinite;"></div>
                    </div>
                </div>
                <div style="font-size:0.82rem;color:var(--text-muted);">
                    <span style="font-weight:800;font-size:1rem;color:var(--neuro-accent);" id="profileGamificationXP">${t.xp}</span> XP
                    <span style="margin:0 4px;opacity:0.4;">·</span>
                    <span id="profileGamificationXPNext">${i.pointsToNext}</span> to next level
                </div>
            </div>

            <!-- 8-stat grid -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                ${r.map(g=>`
                <div style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;
                            padding:10px 6px;text-align:center;
                            box-shadow:3px 3px 8px rgba(0,0,0,0.09),-2px -2px 6px rgba(255,255,255,0.7);
                            transition:transform 0.15s;"
                     onmouseover="this.style.transform='translateY(-2px)'"
                     onmouseout="this.style.transform=''">
                    <div style="font-size:1.3rem;line-height:1;margin-bottom:4px;">${g.emoji}</div>
                    <div ${g.id?`id="${g.id}"`:""} style="font-size:1.15rem;font-weight:800;
                                color:var(--neuro-accent);line-height:1;">${g.value}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);
                                font-weight:600;text-transform:uppercase;
                                letter-spacing:0.03em;margin-top:3px;">${g.label}</div>
                </div>`).join("")}
            </div>
        </div>

        <style>
            @keyframes profile-xp-shimmer {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
        </style>`},animateGamificationBar(){requestAnimationFrame(()=>{const e=document.getElementById("profileGamificationXpBar");e&&(e.style.width=(e.dataset.width||0)+"%")})},refreshGamification(){const e=document.querySelector(".profile-gamification-section");if(!e)return;const t=document.createElement("div");t.innerHTML=this._getGamificationHTML(),e.replaceWith(t.firstElementChild),this.animateGamificationBar()},renderHTML(){const e=document.getElementById("profileHeroContainer");if(!e){console.warn("profileHeroContainer not found - skipping profile render");return}e.innerHTML=this.getHTML()},populateData(){const e=this._user();if(!e){console.warn("window.Core.state.currentUser not available");return}try{this.updateAvatar(e),this.updateName(e),this.updateKarma(e),this.updateBio(e),this.updateStatusRing(e.status),this.updateRole(e),this.updateBadges(),this.updateBirthday(e),this.updateCountry(e),this.updateProfileLocationRow(e),this.animateGamificationBar(),this.loadActivityData().catch(()=>{}),this.loadCommunityStats().catch(()=>{})}catch(t){console.error("Profile data population error:",t)}},updateAvatar(e){var r;const t=document.getElementById("profileAvatar"),i=document.getElementById("profileAvatarImg"),o=document.getElementById("profileAvatarFallback");if(!t)return;const n=e.avatar_url||e.avatarUrl;if(n&&i){i.src=n,i.style.display="block",o&&(o.style.display="none"),t.style.background="transparent";return}o&&(o.textContent=e.emoji||e.avatar||"?",o.style.display="block",i&&(i.style.display="none")),(r=window.Core)!=null&&r.getAvatarGradient&&(t.style.background=window.Core.getAvatarGradient(e.id||e.name||"default"))},updateName(e){const t=document.getElementById("profileName");t&&(t.textContent=e.name||e.displayName||"Member")},updateKarma(e){var d,u;const t=(u=(d=B())==null?void 0:d.getOwnGamificationState)==null?void 0:u.call(d),i=(t==null?void 0:t.karma)??e.karma??0,o=(t==null?void 0:t.xp)??e.xp??0,n=(t==null?void 0:t.level)??e.level??1,r=document.getElementById("profileGamificationXP"),l=document.getElementById("profileGamificationXPNext"),a=document.getElementById("profileGamificationXpBar");if(r&&(r.textContent=o.toLocaleString()),a){const m=[0,800,2e3,4200,7e3,12e3,3e4,6e4,18e4,45e4],g=m[n-1]||0,h=m[n]||m[m.length-1],v=h>g?Math.min(100,Math.round((o-g)/(h-g)*100)):100;a.dataset.width=v,a.style.width=v+"%",l&&(l.textContent=Math.max(0,h-o).toLocaleString())}const s=document.getElementById("statKarma");s&&(s.textContent=i.toLocaleString())},async loadCommunityStats(){var t,i,o,n;if(!((t=B())!=null&&t.ready))return;const e=(i=this._user())==null?void 0:i.id;if(e)try{const[{data:r,error:l},{data:a,error:s}]=await Promise.all([(o=B())==null?void 0:o._sb.from("profiles").select("gifts_given").eq("id",e).single(),(n=B())==null?void 0:n._sb.from("room_entries").select("room_id").eq("user_id",e)]),d=document.getElementById("statBlessings");if(d){const m=!l&&(r==null?void 0:r.gifts_given)!=null?r.gifts_given:0;d.textContent=m.toLocaleString()}const u=document.getElementById("statFavRoom");if(u)if(!s&&(a==null?void 0:a.length)>0){const m={};a.forEach(h=>{m[h.room_id]=(m[h.room_id]||0)+1});const g=Object.entries(m).sort((h,v)=>v[1]-h[1])[0][0];u.textContent=g.replace(/-/g," ").replace(/\b\w/g,h=>h.toUpperCase())}else u.textContent="-"}catch(r){console.warn("[ProfileModule] loadCommunityStats error:",r)}},updateBio(e){const t=document.getElementById("profileInspiration"),i=e.bio||e.inspiration;t&&i&&(t.textContent=`"${i}"`)},updateRole(e){const t=e.community_role||e.role||"Member",i=e.status||"available",o=document.getElementById("profileRoleBadge");o&&(o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${t}`);const n=document.getElementById("privateRole");n&&(n.textContent=t);const r=document.getElementById("privateStatus");r&&(r.textContent=i.charAt(0).toUpperCase()+i.slice(1))},updateBirthday(e){const t=document.getElementById("privateBirthday");if(t)if(e.birthday)try{t.textContent=new Date(e.birthday+"T00:00:00").toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"})}catch{t.textContent=e.birthday}else t.textContent="-"},updateCountry(e){const t=document.getElementById("privateCountry");t&&(t.textContent=e.country||"-")},async updateProfileLocationRow(e){var a,s;let{birthday:t,country:i}=e;if(!t&&!i&&((a=B())!=null&&a.ready))try{const d=await((s=B())==null?void 0:s.getMyProfile());if(d){t=d.birthday,i=d.country;const u=this._user();u&&(u.birthday=t,u.country=i)}}catch{}const o=document.getElementById("profileBirthdayDisplay");if(o)if(t)try{const d=new Date(t+"T00:00:00").toLocaleDateString(void 0,{month:"long",day:"numeric"});o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${d}`}catch{o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${t}`}else o.textContent="";const n=document.getElementById("profileCountryDisplay");n&&(n.textContent=i?`${this._countryFlag(i)} ${i}`:"");const r=document.getElementById("profileCountrySep");r&&(r.style.display=i?"":"none");const l=document.querySelector("#profileMetaRow .profile-meta-sep");l&&(l.style.display=t||i?"":"none")},async loadActivityData(){var n,r,l,a,s,d,u,m,g,h,v,b,x,I,P,Y,z,ee,K,X,ne,re,R,te,ae,ce,se,le,ue,pe,me,de,Z;const e=(n=window.app)==null?void 0:n.gamification,t=((r=e==null?void 0:e.getStatusSummary)==null?void 0:r.call(e))??null,i=((s=(a=(l=window.app)==null?void 0:l.state)==null?void 0:a.getStats)==null?void 0:s.call(a))??null;if(t&&i){this._setActivityCount("journal",t.totalJournalEntries??0,"entries"),this._setActivityCount("gratitude",i.totalGratitudes??0,"entries"),this._setActivityCount("energy",i.totalEnergyEntries??((g=(m=(u=(d=window.app)==null?void 0:d.state)==null?void 0:u.data)==null?void 0:m.energyEntries)==null?void 0:g.length)??0,"check-ins"),this._setActivityCount("flip",i.totalFlipEntries??((x=(b=(v=(h=window.app)==null?void 0:h.state)==null?void 0:v.data)==null?void 0:b.flipEntries)==null?void 0:x.length)??0,"entries"),this._setActivityCount("tarot",t.totalTarotSpreads??0,"readings"),this._setActivityCount("meditation",t.totalMeditations??i.weeklyMeditations??((z=(Y=(P=(I=window.app)==null?void 0:I.state)==null?void 0:P.data)==null?void 0:Y.meditationEntries)==null?void 0:z.length)??0,"sessions"),this._activityData={_fromGamification:!0};return}if((K=(ee=window.app)==null?void 0:ee.state)!=null&&K.ready)try{await window.app.state.ready}catch{}const o=(ne=(X=window.app)==null?void 0:X.state)==null?void 0:ne.data;if(o){const p=(o.gratitudeEntries||[]).reduce((f,y)=>{var M;return f+(((M=y.entries)==null?void 0:M.length)||0)},0);this._setActivityCount("journal",((re=o.journalEntries)==null?void 0:re.length)??0,"entries"),this._setActivityCount("gratitude",p,"entries"),this._setActivityCount("energy",((R=o.energyEntries)==null?void 0:R.length)??0,"check-ins"),this._setActivityCount("flip",((te=o.flipEntries)==null?void 0:te.length)??0,"entries"),this._setActivityCount("tarot",((ae=o.tarotReadings)==null?void 0:ae.length)??0,"readings"),this._setActivityCount("meditation",((ce=o.meditationEntries)==null?void 0:ce.length)??0,"sessions"),this._activityData=o;return}try{if((se=B())!=null&&se.ready){const p=await((le=B())==null?void 0:le.getOwnFullProgress());if(p){const f=(p.gratitudeEntries||[]).reduce((y,M)=>{var _;return y+(((_=M.entries)==null?void 0:_.length)||0)},0);this._setActivityCount("journal",((ue=p.journalEntries)==null?void 0:ue.length)??0,"entries"),this._setActivityCount("gratitude",f,"entries"),this._setActivityCount("energy",((pe=p.energyEntries)==null?void 0:pe.length)??0,"check-ins"),this._setActivityCount("flip",((me=p.flipEntries)==null?void 0:me.length)??0,"entries"),this._setActivityCount("tarot",((de=p.tarotReadings)==null?void 0:de.length)??0,"readings"),this._setActivityCount("meditation",((Z=p.meditationEntries)==null?void 0:Z.length)??0,"sessions"),this._activityData=p}}}catch(p){console.warn("[ProfileModule] loadActivityData fallback failed:",p)}},_setActivityCount(e,t,i){const o=document.getElementById(`activityCount_${e}`);o&&(o.textContent=t>0?`${t} ${i}`:`No ${i} yet`)},async openActivityModal(e){var s;this._activityData||await this.loadActivityData();const i={journal:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Journal Entries'},gratitude:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3-2 2-1-1"/></svg> Gratitude Entries'},energy:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Energy Check-ins'},flip:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Flip the Script'},tarot:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="5" width="11" height="14" rx="2"/><path d="M15.5 5.5 18 3l4 4-5.5 5.5"/><path d="m13 13 4.5 4.5"/><path d="m17.5 17.5 1 1"/></svg> Tarot Spreads'},meditation:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg> Meditation Sessions'}}[e],o=((s=this._activityData)==null?void 0:s[`${e}Entries`])||[],n=document.getElementById("activityModalTitle"),r=document.getElementById("activityModalBody");n&&(n.innerHTML=i.title),r&&(r.innerHTML=o.length?o.map(d=>this._renderActivityEntry(e,d)).join(""):'<div style="text-align:center;color:var(--text-muted);padding:2rem;">No entries yet</div>');const l=document.getElementById("activityModal"),a=document.getElementById("activityModalInner");l&&(l.style.display="flex",requestAnimationFrame(()=>{l.style.opacity="1",a.style.transform="translateY(0)"}),l.onclick=d=>{d.target===l&&this.closeActivityModal()},this._activityEscHandler=d=>{d.key==="Escape"&&this.closeActivityModal()},document.addEventListener("keydown",this._activityEscHandler))},closeActivityModal(){const e=document.getElementById("activityModal"),t=document.getElementById("activityModalInner");e&&(e.style.opacity="0",t.style.transform="translateY(16px)",setTimeout(()=>{e.style.display="none"},250),this._activityEscHandler&&(document.removeEventListener("keydown",this._activityEscHandler),this._activityEscHandler=null))},_renderActivityEntry(e,t){var n;const i=this._formatEntryDate(t.timestamp||t.date),o=`border-radius:12px;padding:12px 14px;margin-bottom:10px;
                      background:var(--surface,rgba(0,0,0,0.03));
                      border-left:3px solid var(--neuro-accent);
                      font-size:0.86rem;line-height:1.6;`;switch(e){case"journal":{const r=t.situation||t.feelings||"",l=t.mood?`<span style="margin-left:6px;opacity:0.7;">${t.mood}</span>`:"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}${l}</div>
                    <div style="color:var(--neuro-text);">${this._esc(r)}</div>
                </div>`}case"gratitude":{const r=t.entries||[];return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${i}</div>
                    ${r.map(l=>`<div style="margin-bottom:3px;display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3-2 2-1-1"/></svg> ${this._esc(l)}</div>`).join("")}
                </div>`}case"energy":{const r=t.energy??"-",l=t.notes?`<div style="margin-top:4px;opacity:0.8;">${this._esc(t.notes)}</div>`:"",a=(t.moodTags||[]).length?`<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;">
                        ${t.moodTags.map(s=>`<span style="background:var(--neuro-accent-a10);color:var(--neuro-accent);border-radius:99px;padding:2px 8px;font-size:0.72rem;">${this._esc(s)}</span>`).join("")}
                       </div>`:"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    <div style="font-size:1rem;font-weight:700;color:var(--neuro-accent);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Energy: ${r}/10</div>
                    ${a}${l}
                </div>`}case"flip":{const r=t.original||t.flipped_from||t.situation||t.text||t.content||"",l=t.flipped||t.reframe||"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    ${r?`<div style="color:var(--neuro-text);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> ${this._esc(r)}</div>`:""}
                    ${l?`<div style="margin-top:6px;color:var(--neuro-accent);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> ${this._esc(l)}</div>`:""}
                </div>`}case"tarot":{const r=t.spreadType||t.spreadKey||"Spread",l=(t.cards||[]).slice(0,3);return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    <div style="font-weight:700;color:var(--neuro-accent);margin-bottom:4px;">🃏 ${this._esc(r)}</div>
                    ${l.length?`<div style="font-size:0.8rem;color:var(--neuro-text);opacity:0.8;">
                        ${l.map(a=>`<div style="margin-bottom:2px;">• ${this._esc(a.name||"")}</div>`).join("")}
                        ${((n=t.cards)==null?void 0:n.length)>3?`<div style="opacity:0.6;">+${t.cards.length-3} more cards</div>`:""}
                    </div>`:""}
                </div>`}case"meditation":{const r=t.title||t.category||"Session",l=t.duration?`${t.duration} min`:"",a=t.chakra?`· ${t.chakra} chakra`:"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    <div style="font-weight:700;color:var(--neuro-accent);display:flex;align-items:center;gap:0.4rem;">
                        🧘 ${this._esc(r)}
                    </div>
                    ${l||a?`<div style="font-size:0.8rem;margin-top:3px;opacity:0.75;">${l}${a}</div>`:""}
                </div>`}default:return""}},updateBadges(){var i,o,n;const e=((n=(o=(i=window.app)==null?void 0:i.gamification)==null?void 0:o.state)==null?void 0:n.badges)??[],t=document.getElementById("statBadges");t&&(t.textContent=e.length)},updateStatusRing(e){const t=this.config.STATUS_RING[e]||this.config.STATUS_RING.offline,i=document.getElementById("statusRing");i&&(i.style.borderColor=t.color,i.style.boxShadow=`0 0 0 4px ${t.color}33`);const o=document.getElementById("statusPickerDot"),n=document.getElementById("statusPickerLabel");o&&(o.style.background=t.color),n&&(n.textContent=t.label)},toggleStatusPicker(){const e=document.getElementById("statusPickerDropdown");if(!e)return;const t=e.style.display!=="none";if(e.style.display=t?"none":"block",!t){const i=o=>{var n;!((n=document.getElementById("statusPickerBtn"))!=null&&n.contains(o.target))&&!e.contains(o.target)&&(e.style.display="none",document.removeEventListener("click",i))};setTimeout(()=>document.addEventListener("click",i),0)}},async setStatus(e,t,i){var d,u,m,g,h;const o=document.getElementById("statusPickerDropdown");o&&(o.style.display="none");const n=(d=this._user())==null?void 0:d.id;n&&window.ActiveMembers&&window.ActiveMembers.updateMemberStatus(n,e);const r=this.config.STATUS_ACTIVITIES[e]||"✨ Available";this.updateStatusRing(e);const l=document.getElementById("statusPickerDot"),a=document.getElementById("statusPickerLabel");l&&(l.style.background=i),a&&(a.textContent=t);const s=this._user();s&&(s.status=e,s.community_status=e);try{const v=((m=(u=window.Core)==null?void 0:u.state)==null?void 0:m.currentRoom)||null;await Promise.all([(g=B())==null?void 0:g.setPresence(e,r,v),(h=B())==null?void 0:h.updateProfile({community_status:e})]),window.Core.showToast(`Status set to ${t}`)}catch(v){console.error("[ProfileModule] setStatus error:",v),window.Core.showToast("Could not update status - please try again")}window.dispatchEvent(new CustomEvent("statusChanged",{detail:{status:e}}))},updatePresenceCount(){var e,t;(t=(e=window.Core)==null?void 0:e.updatePresenceCount)==null||t.call(e)},toggleProfileView(e){var t;e!=="public"&&e!=="private"||(document.querySelectorAll(".v-btn").forEach(i=>{const o=i.textContent.trim()==="Public View",n=e==="public"&&o||e==="private"&&!o;i.classList.toggle("active",n),i.setAttribute("aria-pressed",String(n))}),(t=document.getElementById("privateDetails"))==null||t.classList.toggle("visible",e==="private"),this.state.currentView=e)},async sendPulse(){var i;const e=(i=window.Core)==null?void 0:i.state;if(!e){console.error("Core not available");return}if(e.pulseSent){window.Core.showToast("Already offered");return}const t=document.getElementById("pulseBtn");if(t)try{t.classList.add("sending"),setTimeout(async()=>{var r;t.classList.remove("sending"),t.classList.add("sent"),t.innerHTML='✓<span class="pulse-ripple"></span>',e.pulseSent=!0;const o=document.getElementById("pulseFill");o&&(o.style.width="50%"),window.Core.showToast("Calm offered to the community"),await((r=B())==null?void 0:r.setPresence("online","💗 Offering calm",e.currentRoom||null));const n=this._user();n&&(n.activity="💗 Offering calm")},this.config.PULSE_ANIMATION_DURATION)}catch(o){console.error("Error sending pulse:",o)}},editProfile(){let e=document.getElementById("_avatarFileInput");e||(e=document.createElement("input"),e.id="_avatarFileInput",e.type="file",e.accept="image/jpeg,image/png,image/webp,image/gif",e.style.display="none",document.body.appendChild(e),e.addEventListener("change",()=>{var i;const t=(i=e.files)==null?void 0:i[0];t&&this._uploadAvatar(t),e.value=""})),e.click()},async _uploadAvatar(e){var o;if(e.size>5*1024*1024){window.Core.showToast("Image too large - max 5MB");return}const t=new FileReader;t.onload=n=>{const r=document.getElementById("profileAvatarImg"),l=document.getElementById("profileAvatarFallback"),a=document.getElementById("profileAvatar");r&&(r.src=n.target.result,r.style.display="block"),l&&(l.style.display="none"),a&&(a.style.background="transparent")},t.readAsDataURL(e),window.Core.showToast("Uploading photo...");const i=await((o=B())==null?void 0:o.uploadAvatar(e));if(i){const n=this._user();n&&(n.avatar_url=i),window.Core.showToast("Profile photo updated")}else window.Core.showToast("Upload failed - please try again"),this.updateAvatar(this._user())},async editRole(){var r,l;const e=((r=this._user())==null?void 0:r.role)||"",t=prompt("Enter your community role (e.g. Meditator, Healer, Teacher):",e);if(t===null)return;const i=t.trim().substring(0,60);if(!await((l=B())==null?void 0:l.updateProfile({community_role:i||null}))){window.Core.showToast("Could not save - please try again");return}const n=this._user();n&&(n.community_role=i||"Member",n.role=i||"Member"),this.updateRole(this._user()),window.Core.showToast("Role updated")},async editInspiration(){var l;const e=document.getElementById("profileInspiration");if(!e)return;const t=e.textContent.replace(/"/g,"").trim(),i=prompt("Edit your inspiration message:",t);if(!(i!=null&&i.trim()))return;const o=i.trim().substring(0,this.config.MAX_INSPIRATION_LENGTH).replace(/<[^>]*>/g,"");if(!o)return;if(!await((l=B())==null?void 0:l.updateProfile({inspiration:o}))){window.Core.showToast("Could not save - please try again");return}e.textContent=`"${o}"`;const r=this._user();r&&(r.inspiration=o),window.Core.showToast("Inspiration updated")},async _createInlineEditor({fieldId:e,dbKey:t,currentValue:i,inputType:o,placeholder:n,maxLength:r,successToast:l,validate:a,onSave:s}){const d=document.getElementById(e),u=d==null?void 0:d.closest(".detail-row");if(!u||u.querySelector("input"))return;const m=u.querySelector(".edit-inline-btn");d&&(d.style.display="none"),m&&(m.style.display="none");const g=`flex:1;padding:4px 8px;border-radius:8px;
            border:1px solid rgba(0,0,0,0.15);font-size:0.85rem;
            background:var(--neuro-bg);color:var(--neuro-text);`,h=`margin-left:6px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;font-weight:700;
            background:var(--neuro-accent);color:#fff;`,v=`margin-left:4px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;opacity:0.6;
            background:rgba(0,0,0,0.06);color:var(--neuro-text);`,b=document.createElement("input");b.type=o,b.value=i,b.maxLength=r,b.placeholder=n,b.style.cssText=g;const x=document.createElement("button");x.textContent="✓",x.style.cssText=h;const I=document.createElement("button");I.textContent="✕",I.style.cssText=v;const P=()=>{b.remove(),x.remove(),I.remove(),d&&(d.style.display=""),m&&(m.style.display="")},Y=async()=>{var K;const z=b.value.trim().substring(0,r);if(a){const X=a(z);if(X){window.Core.showToast(X);return}}if(x.disabled=!0,x.textContent="...",!await((K=B())==null?void 0:K.updateProfile({[t]:z||null}))){window.Core.showToast("Could not save - please try again"),x.disabled=!1,x.textContent="✓";return}P(),s(z||null),window.Core.showToast(l)};x.onclick=Y,I.onclick=P,b.addEventListener("keydown",z=>{z.key==="Enter"&&Y(),z.key==="Escape"&&P()}),u.appendChild(b),u.appendChild(x),u.appendChild(I),b.focus()},editBirthday(){var n;const e=document.getElementById("profileBirthdayDisplay");if(!e)return;const t=((n=this._user())==null?void 0:n.birthday)||"",i=document.createElement("input");i.type="date",i.value=t,i.style.cssText=`padding:3px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.15);
            font-size:0.8rem;background:var(--neuro-bg);color:var(--neuro-text);`;const o=async()=>{var s;const r=i.value.trim();if(r&&!/^\d{4}-\d{2}-\d{2}$/.test(r)){window.Core.showToast("Invalid date");return}if(!await((s=B())==null?void 0:s.updateProfile({birthday:r||null}))){window.Core.showToast("Could not save - please try again");return}const a=this._user();a&&(a.birthday=r),i.replaceWith(e),e.style.display="",this.updateBirthday(this._user()),this.updateProfileLocationRow(this._user()),window.Core.showToast("Birthday updated")};i.addEventListener("keydown",r=>{r.key==="Enter"&&o(),r.key==="Escape"&&(i.replaceWith(e),e.style.display="")}),i.addEventListener("blur",o),e.style.display="none",e.parentNode.insertBefore(i,e.nextSibling),i.focus()},editCountry(){var n;const e=document.getElementById("profileCountryDisplay");if(!e)return;const t=((n=this._user())==null?void 0:n.country)||"",i=document.createElement("input");i.type="text",i.value=t,i.placeholder="Your country",i.maxLength=60,i.style.cssText=`padding:3px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.15);
            font-size:0.8rem;background:var(--neuro-bg);color:var(--neuro-text);width:90px;`;const o=async()=>{var s;const r=i.value.trim();if(!await((s=B())==null?void 0:s.updateProfile({country:r||null}))){window.Core.showToast("Could not save - please try again");return}const a=this._user();a&&(a.country=r),i.replaceWith(e),e.style.display="",this.updateCountry(this._user()),this.updateProfileLocationRow(this._user()),window.Core.showToast("Country updated")};i.addEventListener("keydown",r=>{r.key==="Enter"&&o(),r.key==="Escape"&&(i.replaceWith(e),e.style.display="")}),i.addEventListener("blur",o),e.style.display="none",e.parentNode.insertBefore(i,e.nextSibling),i.focus()},setupCharCounter(){const e=document.getElementById("reflectionInput"),t=document.getElementById("charCount");e&&t&&e.addEventListener("input",()=>{t.textContent=e.value.length})},refresh(){this.populateData()}};window.ProfileModule=$e;const ot=Object.freeze(Object.defineProperty({__proto__:null,ProfileModule:$e},Symbol.toStringTag,{value:"Module"}));export{Oe as A,c as C,Pe as E,L as S,We as W,ge as a,rt as b,k as c,fe as d,at as e,xe as r};
