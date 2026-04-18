const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/newmoon-room-2vT5MpwJ.js","assets/lunar-core-Dl02WP80.js","assets/waxingmoon-room-CbmpEvcf.js","assets/fullmoon-room-G3y9dbyT.js","assets/waningmoon-room-CNNDxKGT.js","assets/spring-solar-room-xv1H8Nlh.js","assets/solar-base-room-CZzD3gic.js","assets/summer-solar-room-Bx5lIIsI.js","assets/autumn-solar-room-CaH4Q02Z.js","assets/winter-solar-room-CwgUKbUq.js"])))=>i.map(i=>d[i]);
const mt="modulepreload",ht=function(t){return"/"+t},Ne={},ue=function(e,i,o){let n=Promise.resolve();if(i&&i.length>0){let a=function(d){return Promise.all(d.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));n=a(i.map(d=>{if(d=ht(d),d in Ne)return;Ne[d]=!0;const c=d.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const h=document.createElement("link");if(h.rel=c?"stylesheet":mt,c||(h.as="script"),h.crossOrigin="",h.href=d,l&&h.setAttribute("nonce",l),document.head.appendChild(h),c)return new Promise((m,g)=>{h.addEventListener("load",m),h.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(a){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=a,window.dispatchEvent(s),!s.defaultPrevented)throw a}return n.then(a=>{for(const s of a||[])s.status==="rejected"&&r(s.reason);return e().catch(r)})},rt=window.AppSupabase||null;window.CommunitySupabase=rt;const u={_sb:null,_uid:null,_subs:{},_heartbeatTimer:null,async init(){if(this._sb=window.AppSupabase||rt,!this._sb)return console.error("[CommunityDB] CommunitySupabase not ready — window.AppSupabase is null"),!1;const{data:{user:t},error:e}=await this._sb.auth.getUser();return e||!t?(console.error("[CommunityDB] No authenticated user:",e==null?void 0:e.message),!1):(this._uid=t.id,!0)},get userId(){return this._uid},get ready(){return!!(this._sb&&this._uid)},_err(t,e){console.error(`[CommunityDB] ${t}:`,(e==null?void 0:e.message)??e)},_profileSelect:"id, name, emoji, avatar_url",_ago(t){return new Date(Date.now()-t).toISOString()},_todayUTC(){const t=new Date;return t.setUTCHours(0,0,0,0),t.toISOString()},async getMyProfile(){if(!this.ready)return null;const{data:t,error:e}=await this._sb.from("profiles").select("*").eq("id",this._uid).single();return e?(this._err("getMyProfile",e),null):t},async getProfile(t){if(!this.ready)return null;const{data:e,error:i}=await this._sb.from("profiles").select("id, name, emoji, avatar_url, inspiration, community_status, community_role, total_sessions, total_minutes, gifts_given, birthday, country").eq("id",t).single();return i?(this._err("getProfile",i),null):e},_parseProgress(t){var i,o,n,r,a,s;const e=typeof t=="string"?JSON.parse(t):t;return{xp:e.xp??0,karma:e.karma??0,level:e.level??1,badges:e.badges??[],unlockedFeatures:e.unlockedFeatures??[],streak:((i=e.streaks)==null?void 0:i.current)??((o=e.streak)==null?void 0:o.current)??0,longestStreak:((n=e.streaks)==null?void 0:n.longest)??0,totalSessions:((r=e.stats)==null?void 0:r.totalSessions)??0,totalMeditations:((a=e.stats)==null?void 0:a.totalMeditations)??0,totalReadings:((s=e.stats)==null?void 0:s.totalReadings)??0,totalTarotSpreads:e.totalTarotSpreads??0,totalJournalEntries:e.totalJournalEntries??0,totalWellnessRuns:e.totalWellnessRuns??0,totalHappinessViews:e.totalHappinessViews??0}},async getUserProgress(t){if(!this.ready)return null;try{const{data:e,error:i}=await this._sb.from("user_progress").select("payload").eq("user_id",t).single();return i||!e?null:this._parseProgress(e.payload)}catch(e){return this._err("getUserProgress",e),null}},getOwnGamificationState(){var e;const t=(e=window.app)==null?void 0:e.gamification;return t?this._parseProgress(t.state??t):null},async uploadAvatar(t){if(!this.ready)return null;try{const e=t.name.split(".").pop().toLowerCase()||"jpg",i=`avatars/${this._uid}.${e}`,{error:o}=await this._sb.storage.from("community-avatars").upload(i,t,{upsert:!0,contentType:t.type});if(o)return this._err("uploadAvatar upload",o),null;const{data:n}=this._sb.storage.from("community-avatars").getPublicUrl(i),r=n==null?void 0:n.publicUrl;if(!r)return null;const a=`${r}?t=${Date.now()}`;return await this.updateProfile({avatar_url:a})?a:null}catch(e){return this._err("uploadAvatar",e),null}},async updateProfile(t){if(!this.ready)return!1;const{error:e}=await this._sb.from("profiles").update({...t,updated_at:new Date().toISOString()}).eq("id",this._uid);return e?(this._err("updateProfile",e),!1):!0},async setPresence(t="online",e="✨ Available",i=null){if(!this.ready)return!1;const o=new Date().toISOString(),{error:n}=await this._sb.from("community_presence").upsert({user_id:this._uid,status:t,activity:e,room_id:i,last_seen:o,updated_at:o},{onConflict:"user_id"});return n&&this._err("setPresence",n),!n},async setOffline(){return this.setPresence("offline","💤 Offline",null)},async getActiveMembers(){if(!this.ready)return[];const{data:t,error:e}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!1});return e?(this._err("getActiveMembers",e),[]):t||[]},async getRoomParticipants(t){if(!this.ready)return[];const{data:e,error:i}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).or(`room_id.eq.${t},is_phantom.eq.true`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!0});return i?(this._err("getRoomParticipants",i),[]):e||[]},subscribeToPresence(t){return this._subs.presence&&this._subs.presence.unsubscribe(),this._subs.presence=this._sb.channel("community-presence").on("postgres_changes",{event:"*",schema:"public",table:"community_presence"},async()=>t(await this.getActiveMembers())).subscribe(),this._subs.presence},startHeartbeat(t=6e4){this.stopHeartbeat(),this._heartbeatTimer=setInterval(async()=>{var i,o,n;if(!this.ready)return;const e=(i=typeof Core<"u"?Core:window.Core)==null?void 0:i.state;await this.setPresence(((o=e==null?void 0:e.currentUser)==null?void 0:o.status)||"online",((n=e==null?void 0:e.currentUser)==null?void 0:n.activity)||"✨ Available",(e==null?void 0:e.currentRoom)||null)},t),window.addEventListener("beforeunload",()=>this._cleanup())},stopHeartbeat(){this._heartbeatTimer&&(clearInterval(this._heartbeatTimer),this._heartbeatTimer=null)},_reflectionSelect:"id, content, appreciation_count, created_at, profiles ( id, name, emoji, avatar_url )",async getReflections(t=30){if(!this.ready)return[];const{data:e,error:i}=await this._sb.from("reflections").select(this._reflectionSelect).order("created_at",{ascending:!1}).limit(t);return i?(this._err("getReflections",i),[]):e||[]},async postReflection(t){if(!this.ready)return null;const{data:e,error:i}=await this._sb.from("reflections").insert({user_id:this._uid,content:t}).select(this._reflectionSelect).single();return i?(this._err("postReflection",i),null):e},async deleteReflection(t){if(!this.ready)return!1;const{error:e}=await this._sb.from("reflections").delete().eq("id",t);return e?(this._err("deleteReflection",e),!1):!0},async updateReflection(t,e){if(!this.ready)return!1;const{error:i}=await this._sb.from("reflections").update({content:e}).eq("id",t).eq("user_id",this._uid);return i?(this._err("updateReflection",i),!1):!0},subscribeToReflections(t){return this._subs.reflections&&this._subs.reflections.unsubscribe(),this._subs.reflections=this._sb.channel("community-reflections").on("postgres_changes",{event:"INSERT",schema:"public",table:"reflections"},async({new:e})=>{const{data:i}=await this._sb.from("reflections").select(this._reflectionSelect).eq("id",e.id).single();i&&t(i)}).subscribe(),this._subs.reflections},async getMyAppreciations(){if(!this.ready)return new Set;const{data:t,error:e}=await this._sb.from("appreciations").select("reflection_id").eq("user_id",this._uid);return e?(this._err("getMyAppreciations",e),new Set):new Set(t.map(i=>i.reflection_id))},async toggleAppreciation(t,e){if(!this.ready)return null;if(e){const{error:i}=await this._sb.from("appreciations").delete().eq("user_id",this._uid).eq("reflection_id",t);return i?(this._err("removeAppreciation",i),null):{appreciated:!1}}else{const{error:i}=await this._sb.from("appreciations").insert({user_id:this._uid,reflection_id:t});return i?(this._err("addAppreciation",i),null):{appreciated:!0}}},async getReflectionCount(t){if(!this.ready)return null;const{data:e,error:i}=await this._sb.from("reflections").select("appreciation_count").eq("id",t).single();return i?(this._err("getReflectionCount",i),null):(e==null?void 0:e.appreciation_count)??null},async getMyUserAppreciations(){if(!this.ready)return new Set;const{data:t,error:e}=await this._sb.from("user_appreciations").select("appreciated_user_id").eq("user_id",this._uid);return e?(this._err("getMyUserAppreciations",e),new Set):new Set(t.map(i=>i.appreciated_user_id))},async toggleUserAppreciation(t,e){if(!this.ready)return null;if(e){const{error:i}=await this._sb.from("user_appreciations").delete().eq("user_id",this._uid).eq("appreciated_user_id",t);return i?(this._err("removeUserAppreciation",i),null):{appreciated:!1}}else{const{error:i}=await this._sb.from("user_appreciations").insert({user_id:this._uid,appreciated_user_id:t});return i?(this._err("addUserAppreciation",i),null):{appreciated:!0}}},async getUserAppreciationCount(t){if(!this.ready)return 0;const{count:e,error:i}=await this._sb.from("user_appreciations").select("*",{count:"exact",head:!0}).eq("appreciated_user_id",t);return i?(this._err("getUserAppreciationCount",i),0):e||0},_roomMsgSelect:"id, message, created_at, profiles ( id, name, emoji, avatar_url )",async getRoomMessages(t,e=50){if(!this.ready)return[];const{data:i,error:o}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("room_id",t).order("created_at",{ascending:!0}).limit(e);return o?(this._err("getRoomMessages",o),[]):i||[]},async sendRoomMessage(t,e){if(!this.ready)return null;const{data:i,error:o}=await this._sb.from("room_messages").insert({user_id:this._uid,room_id:t,message:e}).select(this._roomMsgSelect).single();return o?(this._err("sendRoomMessage",o),null):i},subscribeToRoomChat(t,e){const i=`room-${t}`;return this._subs[i]&&this._subs[i].unsubscribe(),this._subs[i]=this._sb.channel(`room-chat-${t}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_messages",filter:`room_id=eq.${t}`},async({new:o})=>{const{data:n}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("id",o.id).single();n&&e(n)}).subscribe(),this._subs[i]},unsubscribeFromRoomChat(t){this._unsub(`room-${t}`)},async sendWhisper(t,e){if(!this.ready)return null;const{data:i,error:o}=await this._sb.from("whispers").insert({sender_id:this._uid,recipient_id:t,message:e}).select().single();return o?(this._err("sendWhisper",o),null):i},async getWhispers(t){if(!this.ready)return[];const{data:e,error:i}=await this._sb.from("whispers").select(`
                id, message, read, created_at,
                sender:profiles!whispers_sender_id_fkey ( id, name, emoji ),
                recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji )
            `).or(`and(sender_id.eq.${this._uid},recipient_id.eq.${t}),and(sender_id.eq.${t},recipient_id.eq.${this._uid})`).order("created_at",{ascending:!0});return i?(this._err("getWhispers",i),[]):e||[]},async markWhisperRead(t){this.ready&&await this._sb.from("whispers").update({read:!0}).eq("id",t)},async markConversationRead(t){this.ready&&await this._sb.from("whispers").update({read:!0}).eq("recipient_id",this._uid).eq("sender_id",t).eq("read",!1)},async getWhisperInbox(){if(!this.ready)return[];try{const{data:t,error:e}=await this._sb.from("whispers").select(`
                    id, message, read, created_at, sender_id, recipient_id,
                    sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url ),
                    recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji, avatar_url )
                `).or(`sender_id.eq.${this._uid},recipient_id.eq.${this._uid}`).order("created_at",{ascending:!1}).limit(200);if(e)return this._err("getWhisperInbox",e),[];const i={};for(const o of t||[]){const n=o.sender_id===this._uid?o.recipient_id:o.sender_id,r=o.sender_id===this._uid?o.recipient:o.sender;i[n]||(i[n]={partnerId:n,partner:r,lastMessage:o.message,lastAt:o.created_at,unread:0}),o.recipient_id===this._uid&&!o.read&&i[n].unread++}return Object.values(i).sort((o,n)=>new Date(n.lastAt)-new Date(o.lastAt))}catch(t){return this._err("getWhisperInbox",t),[]}},async getUnreadWhisperCount(){if(!this.ready)return 0;const{count:t,error:e}=await this._sb.from("whispers").select("id",{count:"exact",head:!0}).eq("recipient_id",this._uid).eq("read",!1);return e?0:t||0},subscribeToWhispers(t){return this._subs.whispersFg&&this._subs.whispersFg.unsubscribe(),this._subs.whispersFg=this._sb.channel("my-whispers-fg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:e})=>{const{data:i}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",e.id).single();i&&t(i)}).subscribe(),this._subs.whispersFg},subscribeToWhispersBackground(t){return this._subs.whispersBg&&this._subs.whispersBg.unsubscribe(),this._subs.whispersBg=this._sb.channel("my-whispers-bg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:e})=>{const{data:i}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",e.id).single();i&&t(i)}).subscribe(),this._subs.whispersBg},async submitReport(t,e,i=""){if(!this.ready)return!1;const{error:o}=await this._sb.from("reports").insert({reporter_id:this._uid,reported_user_id:t,reason:e,details:i});return o?(this._err("submitReport",o),!1):!0},async blockUser(t){if(!this.ready)return!1;const{error:e}=await this._sb.from("blocked_users").insert({user_id:this._uid,blocked_user_id:t});return e?(this._err("blockUser",e),!1):!0},async getBlockedUsers(){if(!this.ready)return new Set;const{data:t,error:e}=await this._sb.from("blocked_users").select("blocked_user_id").eq("user_id",this._uid);return e?new Set:new Set(t.map(i=>i.blocked_user_id))},async getUserByName(t){if(!this.ready)return null;const{data:e,error:i}=await this._sb.from("profiles").select("id, name").ilike("name",t).single();return i?(this._err("getUserByName",i),null):e},async getOwnFullProgress(){if(!this.ready)return null;try{const{data:t,error:e}=await this._sb.from("user_progress").select("payload").eq("user_id",this._uid).single();if(e||!t)return null;const i=typeof t.payload=="string"?JSON.parse(t.payload):t.payload;return{journalEntries:i.journalEntries||[],energyEntries:i.energyEntries||[],gratitudeEntries:i.gratitudeEntries||[],flipEntries:i.flipEntries||[],tarotReadings:i.tarotReadings||[],meditationEntries:i.meditationEntries||[]}}catch(t){return this._err("getOwnFullProgress",t),null}},async getRoomBlessings(t){if(!this.ready)return[];const{data:e,error:i}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",t).order("created_at",{ascending:!1});return i?(this._err("getRoomBlessings",i),[]):e||[]},async blessRoom(t){if(!this.ready)return{status:"error"};const{data:e,error:i}=await this._sb.rpc("bless_room_with_cooldown",{p_room_id:t,p_cooldown_seconds:60});if(i)return this._err("blessRoom rpc",i),{status:"error"};if(e==="cooldown")return{status:"cooldown"};if(e!=="ok")return{status:"error"};const{data:o,error:n}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",t).eq("user_id",this._uid).single();return n?(this._err("blessRoom fetch",n),{status:"ok",data:null}):{status:"ok",data:o}},subscribeToBlessings(t,e){const i=`bless-${t}`;this._subs[i]&&this._subs[i].unsubscribe();const o=async({new:n})=>{if(!(n!=null&&n.user_id))return;const{data:r}=await this._sb.from("profiles").select("name, avatar_url, emoji").eq("id",n.user_id).single();e({roomId:t,userId:n.user_id,name:(r==null?void 0:r.name)||"A member",avatarUrl:(r==null?void 0:r.avatar_url)||"",emoji:(r==null?void 0:r.emoji)||""})};return this._subs[i]=this._sb.channel(i).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_blessings",filter:`room_id=eq.${t}`},o).on("postgres_changes",{event:"UPDATE",schema:"public",table:"room_blessings",filter:`room_id=eq.${t}`},o).subscribe(),this._subs[i]},unsubscribeFromBlessings(t){this._unsub(`bless-${t}`)},async getAppSettings(t){if(!this.ready)return null;const{data:e,error:i}=await this._sb.from("app_settings").select("value").eq("key",t).single();return i?(this._err("getAppSettings",i),null):(e==null?void 0:e.value)??null},async saveAppSettings(t,e){if(!this.ready)return!1;const{error:i}=await this._sb.from("app_settings").upsert({key:t,value:e,updated_at:new Date().toISOString()},{onConflict:"key"});return i?(this._err("saveAppSettings",i),!1):!0},async logRoomEntry(t){if(!this.ready)return null;const{data:e,error:i}=await this._sb.from("room_entries").insert({user_id:this._uid,room_id:t}).select("id").single();return i?(this._err("logRoomEntry",i),null):(e==null?void 0:e.id)||null},async logRoomExit(t){if(!t||!this.ready)return;const{data:e}=await this._sb.from("room_entries").select("entered_at").eq("id",t).single();if(!e)return;const i=Math.round((Date.now()-new Date(e.entered_at).getTime())/1e3);await this._sb.from("room_entries").update({left_at:new Date().toISOString(),duration_seconds:i}).eq("id",t)},async broadcastMessage(t,e){if(!this.ready||!(t!=null&&t.length))return{sent:0,failed:0};const i=t.map(r=>({sender_id:this._uid,recipient_id:r,message:e})),{data:o,error:n}=await this._sb.from("whispers").insert(i).select("id");return n?(this._err("broadcastMessage",n),{sent:0,failed:t.length}):{sent:(o==null?void 0:o.length)||0,failed:t.length-((o==null?void 0:o.length)||0)}},async getAdminNotifications(t=50){if(!this.ready)return[];const{data:e,error:i}=await this._sb.from("admin_notifications").select("*").order("created_at",{ascending:!1}).limit(t);return i?(this._err("getAdminNotifications",i),[]):e||[]},async markNotificationRead(t){if(!this.ready)return!1;const{error:e}=await this._sb.from("admin_notifications").update({read:!0}).eq("id",t);return e?(this._err("markNotificationRead",e),!1):!0},async markAllNotificationsRead(){if(!this.ready)return!1;const{error:t}=await this._sb.from("admin_notifications").update({read:!0}).eq("read",!1);return t?(this._err("markAllNotificationsRead",t),!1):!0},async getUnreadNotificationCount(){if(!this.ready)return 0;const{count:t,error:e}=await this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1);return e?(this._err("getUnreadNotificationCount",e),0):t||0},async getAdminMemberStats(){if(!this.ready)return{};const[t,e,i]=await Promise.all([this._sb.from("profiles").select("*",{count:"exact",head:!0}),this._sb.from("profiles").select("*",{count:"exact",head:!0}).gte("updated_at",this._ago(10080*6e4)),this._sb.from("community_presence").select("*",{count:"exact",head:!0}).neq("status","offline").gte("last_seen",this._ago(5*6e4))]);return{total:t.count||0,newThisWeek:e.count||0,onlineNow:i.count||0}},async getAdminEngagementStats(){if(!this.ready)return{};const t=this._todayUTC(),[e,i,o,n]=await Promise.all([this._sb.from("reflections").select("*",{count:"exact",head:!0}).gte("created_at",t),this._sb.from("reflections").select("*",{count:"exact",head:!0}),this._sb.from("whispers").select("*",{count:"exact",head:!0}).gte("created_at",t),this._sb.from("appreciations").select("*",{count:"exact",head:!0}).gte("created_at",t)]);return{reflectionsToday:e.count||0,reflectionsTotal:i.count||0,whispersToday:o.count||0,appreciationsToday:n.count||0}},async getLeaderboard(){if(!this.ready)return{xp:[],karma:[]};const{data:t,error:e}=await this._sb.from("user_progress").select("user_id, payload->xp, payload->karma, payload->level").limit(50);if(e)return this._err("getLeaderboard",e),{xp:[],karma:[]};const i=(t||[]).map(s=>s.user_id);if(!i.length)return{xp:[],karma:[]};const{data:o}=await this._sb.from("profiles").select("id, name, emoji, avatar_url").in("id",i),n=Object.fromEntries((o||[]).map(s=>[s.id,s])),r=(t||[]).filter(s=>n[s.user_id]).map(s=>({user_id:s.user_id,profiles:n[s.user_id],payload:{xp:s.xp??0,karma:s.karma??0,level:s.level??1}})),a=s=>[...r].sort((l,d)=>{var c,p;return(((c=d.payload)==null?void 0:c[s])||0)-(((p=l.payload)==null?void 0:p[s])||0)}).slice(0,3);return{xp:a("xp"),karma:a("karma")}},async getRoomUsageToday(){if(!this.ready)return[];const{data:t,error:e}=await this._sb.from("room_entries").select("room_id, duration_seconds").gte("entered_at",this._todayUTC());if(e)return this._err("getRoomUsageToday",e),[];const i={};for(const o of t||[])i[o.room_id]||(i[o.room_id]={room_id:o.room_id,entries:0,totalSeconds:0}),i[o.room_id].entries++,i[o.room_id].totalSeconds+=o.duration_seconds||0;return Object.values(i).sort((o,n)=>n.entries-o.entries)},async getPushSubscriptionCount(){if(!this.ready)return 0;const{count:t,error:e}=await this._sb.from("push_subscriptions").select("*",{count:"exact",head:!0});return e?(this._err("getPushSubscriptionCount",e),0):t||0},async getRetentionSignals(){if(!this.ready)return{quietMembers:[],streakMembers:[]};const[t,e,i]=await Promise.all([this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(10080*6e4)).neq("status","offline"),this._sb.from("community_presence").select("user_id").gte("last_seen",this._ago(336*60*6e4)).lt("last_seen",this._ago(10080*6e4)),this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(4320*6e4))]),o=new Set((t.data||[]).map(s=>s.user_id)),r=[...new Set((e.data||[]).map(s=>s.user_id))].filter(s=>!o.has(s)).slice(0,5),a=(i.data||[]).filter(s=>s.profiles).slice(0,5).map(s=>{var l,d;return{user_id:s.user_id,name:(l=s.profiles)==null?void 0:l.name,emoji:(d=s.profiles)==null?void 0:d.emoji}});return{quietMembers:r,streakMembers:a}},async getSafetyStats(){if(!this.ready)return{};const[t,e,i]=await Promise.all([this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("type","report").gte("created_at",this._ago(10080*6e4)),this._sb.from("blocked_users").select("*",{count:"exact",head:!0}),this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1)]);return{reportsThisWeek:t.count||0,blockedTotal:e.count||0,unreadNotifs:i.count||0}},async getRecentReflectionsAdmin(t=5){if(!this.ready)return[];const{data:e,error:i}=await this._sb.from("reflections").select("id, content, created_at, user_id, profiles!reflections_user_id_fkey(id, name, emoji, avatar_url)").order("created_at",{ascending:!1}).limit(t);if(i){this._err("getRecentReflectionsAdmin",i);const{data:o}=await this._sb.from("reflections").select("id, content, created_at, author_id").order("created_at",{ascending:!1}).limit(t);return o||[]}return e||[]},async adminUpdateGamification(t,{xpDelta:e=0,karmaDelta:i=0,unlockFeature:o=null,badgeId:n=null,badgeName:r=null,badgeIcon:a="🏅",badgeRarity:s="common",badgeXp:l=0,badgeDesc:d=""}={}){if(!this.ready)return!1;try{const{error:c}=await this._sb.rpc("update_user_gamification",{target_user_id:t,xp_delta:e,karma_delta:i,unlock_feature:o,badge_id:n,badge_name:r,badge_icon:a,badge_rarity:s,badge_xp:l,badge_desc:d});if(c)throw new Error(c.message);return!0}catch(c){return this._err("adminUpdateGamification",c),!1}},_unsub(t){this._subs[t]&&(this._subs[t].unsubscribe(),delete this._subs[t])},unsubscribeAll(){for(const t of Object.values(this._subs))try{t.unsubscribe()}catch{}this._subs={}},async _cleanup(){this.stopHeartbeat(),await this.setOffline(),this.unsubscribeAll()}};window.addEventListener("pagehide",()=>u._cleanup());window.CommunityDB=u;function gt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Ie={exports:{}},Ue;function yt(){return Ue||(Ue=1,(function(t,e){(function(){var i=Math.PI,o=Math.sin,n=Math.cos,r=Math.tan,a=Math.asin,s=Math.atan2,l=Math.acos,d=i/180,c=1e3*60*60*24,p=2440588,h=2451545;function m(y){return y.valueOf()/c-.5+p}function g(y){return new Date((y+.5-p)*c)}function f(y){return m(y)-h}var b=d*23.4397;function M(y,v){return s(o(y)*n(b)-r(v)*o(b),n(y))}function C(y,v){return a(o(v)*n(b)+n(v)*o(b)*o(y))}function _(y,v,x){return s(o(y),n(y)*o(v)-r(x)*n(v))}function k(y,v,x){return a(o(v)*o(x)+n(v)*n(x)*n(y))}function A(y,v){return d*(280.16+360.9856235*y)-v}function j(y){return y<0&&(y=0),2967e-7/Math.tan(y+.00312536/(y+.08901179))}function T(y){return d*(357.5291+.98560028*y)}function P(y){var v=d*(1.9148*o(y)+.02*o(2*y)+3e-4*o(3*y)),x=d*102.9372;return y+v+x+i}function U(y){var v=T(y),x=P(v);return{dec:C(x,0),ra:M(x,0)}}var B={};B.getPosition=function(y,v,x){var E=d*-x,I=d*v,z=f(y),R=U(z),D=A(z,E)-R.ra;return{azimuth:_(D,I,R.dec),altitude:k(D,I,R.dec)}};var W=B.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];B.addTime=function(y,v,x){W.push([y,v,x])};var O=9e-4;function V(y,v){return Math.round(y-O-v/(2*i))}function $(y,v,x){return O+(y+v)/(2*i)+x}function S(y,v,x){return h+y+.0053*o(v)-.0069*o(2*x)}function F(y,v,x){return l((o(y)-o(v)*o(x))/(n(v)*n(x)))}function G(y){return-2.076*Math.sqrt(y)/60}function Z(y,v,x,E,I,z,R){var D=F(y,x,E),q=$(D,v,I);return S(q,z,R)}B.getTimes=function(y,v,x,E){E=E||0;var I=d*-x,z=d*v,R=G(E),D=f(y),q=V(D,I),K=$(0,I,q),te=T(K),se=P(te),pe=C(se,0),ie=S(K,te,se),le,me,oe,J,de,he,Y={solarNoon:g(ie),nadir:g(ie-.5)};for(le=0,me=W.length;le<me;le+=1)oe=W[le],J=(oe[0]+R)*d,de=Z(J,I,z,pe,q,te,se),he=ie-(de-ie),Y[oe[1]]=g(he),Y[oe[2]]=g(de);return Y};function Q(y){var v=d*(218.316+13.176396*y),x=d*(134.963+13.064993*y),E=d*(93.272+13.22935*y),I=v+d*6.289*o(x),z=d*5.128*o(E),R=385001-20905*n(x);return{ra:M(I,z),dec:C(I,z),dist:R}}B.getMoonPosition=function(y,v,x){var E=d*-x,I=d*v,z=f(y),R=Q(z),D=A(z,E)-R.ra,q=k(D,I,R.dec),K=s(o(D),r(I)*n(R.dec)-o(R.dec)*n(D));return q=q+j(q),{azimuth:_(D,I,R.dec),altitude:q,distance:R.dist,parallacticAngle:K}},B.getMoonIllumination=function(y){var v=f(y||new Date),x=U(v),E=Q(v),I=149598e3,z=l(o(x.dec)*o(E.dec)+n(x.dec)*n(E.dec)*n(x.ra-E.ra)),R=s(I*o(z),E.dist-I*n(z)),D=s(n(x.dec)*o(x.ra-E.ra),o(x.dec)*n(E.dec)-n(x.dec)*o(E.dec)*n(x.ra-E.ra));return{fraction:(1+n(R))/2,phase:.5+.5*R*(D<0?-1:1)/Math.PI,angle:D}};function ee(y,v){return new Date(y.valueOf()+v*c/24)}B.getMoonTimes=function(y,v,x,E){var I=new Date(y);E?I.setUTCHours(0,0,0,0):I.setHours(0,0,0,0);for(var z=.133*d,R=B.getMoonPosition(I,v,x).altitude-z,D,q,K,te,se,pe,ie,le,me,oe,J,de,he,Y=1;Y<=24&&(D=B.getMoonPosition(ee(I,Y),v,x).altitude-z,q=B.getMoonPosition(ee(I,Y+1),v,x).altitude-z,se=(R+q)/2-D,pe=(q-R)/2,ie=-pe/(2*se),le=(se*ie+pe)*ie+D,me=pe*pe-4*se*D,oe=0,me>=0&&(he=Math.sqrt(me)/(Math.abs(se)*2),J=ie-he,de=ie+he,Math.abs(J)<=1&&oe++,Math.abs(de)<=1&&oe++,J<-1&&(J=de)),oe===1?R<0?K=Y+J:te=Y+J:oe===2&&(K=Y+(le<0?de:J),te=Y+(le<0?J:de)),!(K&&te));Y+=2)R=q;var we={};return K&&(we.rise=ee(I,K)),te&&(we.set=ee(I,te)),!K&&!te&&(we[le>0?"alwaysUp":"alwaysDown"]=!0),we},t.exports=B})()})(Ie)),Ie.exports}var ft=yt();const ve=gt(ft),w={state:{currentUser:{id:null,name:"Loading...",avatar:"?",emoji:"",avatar_url:null,bio:"",status:"online",role:"Member",karma:0,xp:0,badges:[],minutes:0,circles:0,offered:0,birthday:null,country:null,email:"",is_admin:!1},currentRoom:null,currentActivity:"✨ Available",presenceCount:0,presenceInterval:null,pulseSent:!1,timerRunning:!1,timeLeft:1200,currentView:"hubView",initialized:!1},config:{ROOM_MODULES:["SilentRoom","CampfireRoom","GuidedRoom","BreathworkRoom","OshoRoom","DeepWorkRoom","TarotRoom","ReikiRoom"],STATUS_RINGS:{silent:"#60a5fa",available:"#34d399",guiding:"#fbbf24",deep:"#a78bfa",resonant:"#f472b6",offline:"#d1d5db"},AVATAR_GRADIENTS:["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)","linear-gradient(135deg, #fa709a 0%, #fee140 100%)"],ADMIN_MODULES:["CollectiveField","LunarEngine","SolarEngine","UpcomingEvents","AdminDashboard"],RENDER_DELAY:100,CELESTIAL_INIT_DELAY:500,CELESTIAL_POLL_MAX:25,PRESENCE_INTERVAL:3e4,HEARTBEAT_INTERVAL:6e4,PULSE_COOLDOWN:6e4},async init(){var t,e;if(this.state.initialized){console.warn("[Core] Already initialized");return}try{if(!await u.init())throw new Error("Database not ready - is the user logged in?");if(await this.loadCurrentUser(),!this.state.currentUser.avatar_url){const o=(e=(t=window.app)==null?void 0:t.state)==null?void 0:e.currentUser,n=(o==null?void 0:o.avatarUrl)||(o==null?void 0:o.avatar_url)||null;n&&(this.state.currentUser.avatar_url=n)}if(await u.setPresence(this.state.currentUser.status||"online",this.state.currentUser.activity||"✨ Available",null),u.startHeartbeat(this.config.HEARTBEAT_INTERVAL),window.addEventListener("pagehide",()=>{u.setOffline(),u.unsubscribeAll()}),this.setupEventListeners(),this.initializeSafetyModals(),this.initializeModules(),this.initializePracticeRooms(),this.scheduleRoomRendering(),this.scheduleCelestialInit(),this.updatePresenceCount(),setTimeout(()=>this._injectAdminUIAll(),1e3),this.state.initialized=!0,window._pendingHubScrollTarget){const o=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,(()=>{let a=0,s=0,l=0;const d=setInterval(()=>{if(a++,document.body.classList.contains("ritual-active")){s=0,l=0;return}const c=document.getElementById(o),p=c?c.offsetHeight:0;if(p>10&&(p===s?l++:l=0,s=p),(l>=3||a>=60)&&p>0){clearInterval(d);const m=document.getElementById("mobile-bottom-bar"),g=m?m.offsetHeight+16:16;requestAnimationFrame(()=>{const f=c.getBoundingClientRect().top+window.scrollY-g;window.scrollTo({top:f,behavior:"smooth"})})}else a>=60&&clearInterval(d)},100)})()}}catch(i){console.error("❌ [Core] Initialization failed:",i),this.handleInitializationError(i)}},async loadCurrentUser(){var t,e,i,o,n,r,a,s,l;try{const d=await u.getMyProfile();if(!d){console.warn("[Core] No profile found for current user");return}const p=new Set(["online","available","away","guiding","silent","deep","offline"]).has(d.community_status)?d.community_status:"online";this.state.currentUser={id:d.id,name:d.name||"Anonymous",avatar:(d.name||"A").charAt(0).toUpperCase(),emoji:d.emoji||"",avatar_url:d.avatar_url||null,bio:d.inspiration||"Here to practice with intention.",status:p,community_status:p,role:d.is_admin?"Admin":d.community_role||"Member",community_role:d.community_role||"Member",minutes:d.total_minutes||0,circles:d.total_sessions||0,offered:d.gifts_given||0,birthday:d.birthday||null,country:d.country||null,email:d.email||"",is_admin:!!d.is_admin,karma:((i=(e=(t=window.app)==null?void 0:t.gamification)==null?void 0:e.state)==null?void 0:i.karma)??0,xp:((r=(n=(o=window.app)==null?void 0:o.gamification)==null?void 0:n.state)==null?void 0:r.xp)??0,badges:((l=(s=(a=window.app)==null?void 0:a.gamification)==null?void 0:s.state)==null?void 0:l.badges)??[]}}catch(d){console.error("[Core] loadCurrentUser failed:",d)}},initializeModules(){var e;const t=[{name:"Rituals",instance:window.Rituals},{name:"ProfileModule",instance:window.ProfileModule},{name:"CommunityModule",instance:window.CommunityModule}];for(const{name:i,instance:o}of t)if(o!=null&&o.init)try{o.init()}catch(n){console.error(`✗ [Core] ${i} init failed:`,n)}else console.warn(`⚠ [Core] ${i} not found or missing init()`);(e=window.ActiveMembers)!=null&&e.render?window.ActiveMembers.render().catch(i=>console.error("✗ [Core] ActiveMembers.render() failed:",i)):console.warn("⚠ [Core] ActiveMembers not found")},_injectAdminUIAll(){for(const t of this.config.ADMIN_MODULES){const e=window[t];if(e!=null&&e.injectAdminUI)try{e.injectAdminUI()}catch(i){console.warn(`[Core] injectAdminUI failed on ${t}:`,i)}}},handleInitializationError(t){this.showToast("Failed to initialize. Please refresh the page."),console.error("[Core] Init error details:",{message:t.message,stack:t.stack,state:this.state})},initializePracticeRooms(){const t=[];for(const e of this.config.ROOM_MODULES){const i=window[e];if(!i){console.warn(`⚠ [Core] ${e} not found on window`);continue}if(!i.init){console.warn(`⚠ [Core] ${e} missing init()`);continue}try{i.init(),t.push(i)}catch(o){console.error(`✗ [Core] ${e} init failed:`,o)}}window.PracticeRoom&&t.length&&PracticeRoom.startHubPresence(t)},scheduleRoomRendering(){setTimeout(()=>{try{this.renderRooms()}catch(t){console.error("[Core] Room rendering failed:",t)}},this.config.RENDER_DELAY)},renderRooms(){const t=document.getElementById("roomsGrid");if(!t){console.warn("[Core] #roomsGrid not found - skipping render");return}const e=this.config.ROOM_MODULES.reduce((i,o)=>{const n=window[o];if(!(n!=null&&n.getRoomCardHTML))return console.warn(`⚠ [Core] ${o} missing getRoomCardHTML()`),i;try{const r=n.getRoomCardHTML();r&&i.push(r)}catch(r){console.error(`✗ [Core] getRoomCardHTML failed for ${o}:`,r)}return i},[]);e.length?t.innerHTML=e.join(""):console.warn("[Core] No room cards to render")},scheduleCelestialInit(){setTimeout(()=>{try{this.initializeCelestialSystems()}catch(t){console.error("[Core] Celestial init failed:",t)}},this.config.CELESTIAL_INIT_DELAY)},initializeCelestialSystems(){for(const[t,e]of[["LunarEngine",window.LunarEngine],["SolarEngine",window.SolarEngine]])if(e!=null&&e.init)try{e.init()}catch(i){console.error(`✗ [Core] ${t} init failed:`,i)}else console.warn(`⚠ [Core] ${t} not found`)},navigateTo(t){var e,i;try{const o=document.getElementById("communityHubFullscreenContainer"),n=document.getElementById("community-hub-tab");t==="hubView"?(o&&(o.style.display="none"),n&&(n.style.display="block"),document.body.style.overflow="",document.querySelectorAll("#hubView").forEach(r=>r.classList.add("active")),this.state.currentView="hubView"):t==="practiceRoomView"?(o&&(o.style.display="flex",(e=o.querySelector("#openingOverlay"))==null||e.classList.remove("active"),(i=o.querySelector("#closingOverlay"))==null||i.classList.remove("active")),n?n.style.display="none":console.error("[Core] Hub tab element not found"),document.body.style.overflow="hidden",this.state.currentView="practiceRoomView"):console.warn(`[Core] Unknown viewId: "${t}"`)}catch(o){console.error("[Core] Navigation error:",o)}},setupEventListeners(){document.addEventListener("click",t=>{t.target.classList.contains("modal-overlay")&&t.target.classList.remove("active")}),document.addEventListener("keydown",t=>{var e;t.key==="Escape"&&((e=document.querySelector(".modal-overlay.active"))==null||e.classList.remove("active"))})},async updatePresenceCount(){this.state.presenceInterval&&clearInterval(this.state.presenceInterval);const t=async()=>{try{if(!u.ready)return;const e=await u.getActiveMembers();this.state.presenceCount=e.length;const i=document.getElementById("presenceCount");i&&(i.textContent=e.length)}catch(e){console.error("[Core] updatePresenceCount error:",e)}};await t(),this.state.presenceInterval=setInterval(t,this.config.PRESENCE_INTERVAL)},sendPulse(){if(this.state.pulseSent){this.showToast("Please wait before sending another pulse");return}this.state.pulseSent=!0,this.showToast("Pulse sent to the community"),setTimeout(()=>{this.state.pulseSent=!1},this.config.PULSE_COOLDOWN)},showToast(t,e=3e3){const i=document.getElementById("toast");if(!i){console.warn("[Core] #toast element not found");return}i.textContent=t,i.classList.add("show"),setTimeout(()=>i.classList.remove("show"),e)},initializeSafetyModals(){document.getElementById("reportModal")||document.body.insertAdjacentHTML("beforeend",`
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
        `)},formatTime(t){if(typeof t!="number"||t<0)return"0:00";const e=Math.floor(t/60),i=Math.floor(t%60);return`${e}:${i.toString().padStart(2,"0")}`},getAvatarGradient(t){(!t||typeof t!="string")&&(t="default");const e=t.split("").reduce((i,o)=>i+o.charCodeAt(0),0);return this.config.AVATAR_GRADIENTS[Math.abs(e)%this.config.AVATAR_GRADIENTS.length]}};window.Core=w;const Te={user:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',aries:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10c0-3.31-2.69-6-6-6"/><path d="M12 20V10c0-3.31 2.69-6 6-6"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg>',taurus:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><path d="M5 9C5 6 7 3 12 3s7 3 7 6"/><path d="M9 9H4"/><path d="M20 9h-5"/></svg>',gemini:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="8" y1="4" x2="16" y2="4"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',cancer:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M4 8c0-2 1-4 4-4"/><path d="M20 16c0 2-1 4-4 4"/></svg>',leo:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><path d="M12 8h4a4 4 0 0 1 0 8h-1"/><path d="M15 16v4"/></svg>',virgo:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4V8a6 6 0 0 0-12 0"/><path d="M15 16v4"/><path d="M17 16l1.5 4"/></svg>',libra:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="20" x2="21" y2="20"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 16a6 6 0 0 0 12 0"/></svg>',scorpio:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><line x1="18" y1="4" x2="18" y2="12"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4"/><polyline points="15 9 18 12 21 9"/></svg>',sagittarius:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/><line x1="5" y1="19" x2="12" y2="12"/></svg>',capricorn:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20V8a4 4 0 0 1 8 0v4a4 4 0 0 0 4 4h0"/><path d="M18 16l2 2-2 2"/></svg>',aquarius:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/><path d="M3 16c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/></svg>',pisces:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><path d="M4 8c2 2 4 4 8 4s6-2 8-4"/><path d="M4 16c2-2 4-4 8-4s6 2 8 4"/></svg>',meditation:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3"/><path d="M12 12l3 3"/><path d="M6 17c0-2 2-4 6-4s6 2 6 4"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',sun:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',crystal:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4z"/></svg>',butterfly:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12C12 12 8 9 4 10c-3 1-3 5 0 6 2 1 5 0 8-4z"/><path d="M12 12C12 12 16 9 20 10c3 1 3 5 0 6-2 1-5 0-8-4z"/><circle cx="12" cy="5" r="2"/></svg>',leaf:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/><path d="M22 2C11 2 2 11 2 22c5.5 0 11-2.5 14.5-6S22 7.5 22 2z"/></svg>',flower:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>',om:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 0 8 0"/><circle cx="12" cy="8" r="1"/></svg>',clover:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.5-4-3-6-2s-3 4-1 6 5 2 7-4z"/><path d="M12 12c2-2.5 4-3 6-2s3 4 1 6-5 2-7-4z"/><path d="M12 12c-2.5-2-3-4-2-6s4-3 6-1-2 5-4 7z"/><path d="M12 12c2.5-2 3-4 2-6s-4-3-6-1 2 5 4 7z"/><line x1="12" y1="12" x2="12" y2="22"/></svg>'},Fe={"👤":"user","♈️":"aries","♉️":"taurus","♊️":"gemini","♋️":"cancer","♌️":"leo","♍️":"virgo","♎️":"libra","♏️":"scorpio","♐️":"sagittarius","♑️":"capricorn","♒️":"aquarius","♓️":"pisces","🧘‍♀️":"meditation","🌙":"moon","☀️":"sun","🌟":"star","🔮":"crystal","🦋":"butterfly","🌿":"leaf","🌸":"flower","🕉️":"om","🍀":"clover"};function De(t){return Te[t]||Te[t in Fe?Fe[t]:"user"]||Te.user}const bt=["🏅","🎖️","🌟","👑","🧪","🕉️","🦸","🌱","🎪","🌙","☀️","⚡","🌊","💜","🔱","🔥","💎","🦋","🌸","🍀","🌈","⭐","🎯","🏆","🎗️","🌀","🔮","💫","🧘","🦅","🐉","🌺","🎵","💡","🌿","🦁","🐬","🌍","🎭","🛡️","⚔️","🗝️","🧬","🌠","🎋"],vt={state:{isOpen:!1,currentUserId:null,isAppreciated:!1,appreciationCount:0},_LEVEL_TITLES:{1:"Seeker",2:"Practitioner",3:"Adept",4:"Healer",5:"Master",6:"Sage",7:"Enlightened",8:"Buddha",9:"Light",10:"Emptiness"},_STATUS_RINGS:{online:{c:"var(--ring-available,#6b9b37)",s:"rgba(107,155,55,0.2)"},available:{c:"var(--ring-available,#6b9b37)",s:"rgba(107,155,55,0.2)"},away:{c:"var(--ring-guiding,#e53e3e)",s:"rgba(229,62,62,0.2)"},silent:{c:"var(--ring-silent,#7c3aed)",s:"rgba(124,58,237,0.2)"},deep:{c:"var(--ring-deep,#1e40af)",s:"rgba(30,64,175,0.2)"},offline:{c:"var(--ring-offline,#9ca3af)",s:"rgba(156,163,175,0.2)"}},_RARITY_COLORS:{common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"},_RARITY_LABELS:{common:"Common",uncommon:"Uncommon",rare:"Rare",epic:"Epic",legendary:"Legendary"},_COUNTRY_CODES:{israel:"IL","united states":"US",usa:"US",us:"US","united kingdom":"GB",uk:"GB",canada:"CA",australia:"AU",germany:"DE",france:"FR",spain:"ES",italy:"IT",netherlands:"NL",belgium:"BE",switzerland:"CH",sweden:"SE",norway:"NO",denmark:"DK",finland:"FI",poland:"PL",portugal:"PT",austria:"AT",india:"IN",china:"CN",japan:"JP","south korea":"KR",brazil:"BR",mexico:"MX",argentina:"AR","south africa":"ZA",russia:"RU",ukraine:"UA",greece:"GR",turkey:"TR",egypt:"EG","new zealand":"NZ",ireland:"IE",singapore:"SG",thailand:"TH",indonesia:"ID",malaysia:"MY",philippines:"PH"},_ADMIN_SUB_IDS:["adminSubRole","adminSubXp","adminSubKarma","adminSubBadge","adminSubPremium","adminSubMessage","adminSubCustomBadge"],_buildEmojiPicker(t,e){return`
            <div id="${e}" style="display:none;margin-top:6px;padding:8px;border-radius:10px;
                        border:1px solid rgba(0,0,0,0.12);background:var(--neuro-bg);
                        display:none;flex-wrap:wrap;gap:4px;max-height:130px;overflow-y:auto;">
                ${bt.map(i=>`<button type="button" onclick="MemberProfileModal._pickEmoji('${t}','${e}','${i}')"
                             style="font-size:1.3rem;background:none;border:none;cursor:pointer;
                                    padding:3px 5px;border-radius:6px;line-height:1;transition:background 0.1s;"
                             onmouseover="this.style.background='rgba(0,0,0,0.07)'"
                             onmouseout="this.style.background='none'">${i}</button>`).join("")}
            </div>`},_pickEmoji(t,e,i){const o=document.getElementById(t);o&&(o.value=i);const n=document.getElementById(e);n&&(n.style.display="none")},_toggleEmojiPicker(t){const e=document.getElementById(t);e&&(e.style.display=e.style.display==="none"?"flex":"none")},init(){if(document.getElementById("memberProfileModal"))return;window.addEventListener("statusChanged",o=>{var l;const{status:n}=o.detail||{};if(!n||!this.state.isOpen||!(this.state.currentUserId===((l=window.Core.state.currentUser)==null?void 0:l.id)))return;const a=document.getElementById("memberModalStatusRing");if(!a)return;const s=this._STATUS_RINGS[n]||this._STATUS_RINGS.offline;a.style.borderColor=s.c,a.style.boxShadow=`0 0 0 3px ${s.s}`}),window.addEventListener("avatarChanged",o=>{const{userId:n,emoji:r,avatarUrl:a}=o.detail||{};if(!n||!this.state.isOpen||this.state.currentUserId!==n)return;const s=document.getElementById("memberModalAvatar");s&&(a?(s.style.background="transparent",s.innerHTML=`<img src="${a}" loading="lazy" decoding="async" width="80" height="80"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="avatar">`):r&&(s.style.background="",s.innerHTML=`<span>${De(r)}</span>`))});const e=(window.BADGE_REGISTRY||[]).map(o=>`<option value="${o.id}" data-icon="${o.icon}" data-rarity="${o.rarity}" data-xp="${o.xp}" data-desc="${o.desc}">${o.icon} ${o.name}</option>`).join(""),i=document.createElement("div");i.innerHTML=`
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

                        <!-- Avatar + name + meta row -->
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

                        <!-- Inspiration -->
                        <div id="memberModalInspiration"
                             style="font-size:0.85rem;font-style:italic;color:var(--neuro-text-light,#555);
                                    text-align:center;margin-bottom:1rem;padding:0 0.5rem;line-height:1.5;"></div>

                        <!-- Level + XP bar -->
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

                        <!-- 4-stat grid -->
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

                        <!-- Appreciate -->
                        <button id="memberModalAppreciateBtn"
                                onclick="MemberProfileModal.toggleAppreciate()"
                                style="width:100%;padding:10px;border-radius:12px;border:none;cursor:pointer;
                                       font-size:0.9rem;font-weight:600;margin-bottom:10px;
                                       background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                                       box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                       transition:all 0.2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciate
                        </button>

                        <!-- Actions -->
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

                        <!-- Whisper panel -->
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

                        <!-- Report panel -->
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

                        <!-- Admin section -->
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

                                <!-- Sub: Change Role -->
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

                                <!-- Sub: Send XP -->
                                <div id="adminSubXp" style="display:none;" class="admin-sub-panel">
                                    <input type="number" id="adminXpAmount" min="1" value="100" placeholder="XP amount"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    ${this._adminSubFooter("_adminSendXP","Send XP")}
                                </div>

                                <!-- Sub: Send Karma -->
                                <div id="adminSubKarma" style="display:none;" class="admin-sub-panel">
                                    <input type="number" id="adminKarmaAmount" min="1" value="50" placeholder="Karma amount"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    ${this._adminSubFooter("_adminSendKarma","Send Karma")}
                                </div>

                                <!-- Sub: Send Badge (from registry) -->
                                <div id="adminSubBadge" style="display:none;" class="admin-sub-panel">
                                    <select id="adminBadgeSelect"
                                            style="width:100%;padding:9px;border-radius:10px;margin-bottom:8px;
                                                   border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                   background:var(--neuro-bg);color:var(--neuro-text);">
                                        ${e}
                                    </select>
                                    ${this._adminSubFooter("_adminSendBadge","Award Badge")}
                                </div>

                                <!-- Sub: Custom Badge -->
                                <div id="adminSubCustomBadge" style="display:none;" class="admin-sub-panel">

                                    <!-- Emoji row: preview + pick button -->
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

                                    <!-- XP + Karma side by side -->
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

                                <!-- Sub: Unlock Premium -->
                                <div id="adminSubPremium" style="display:none;" class="admin-sub-panel">
                                    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;
                                                max-height:160px;overflow-y:auto;padding:4px 0;">
                                        ${[["advance_tarot_spreads","Advanced Tarot Spreads"],["tarot_vision_ai","Tarot Vision AI"],["shadow_alchemy_lab","Shadow Alchemy Lab"],["advanced_meditations","Advanced Meditations"],["luxury_blush_champagne_skin","Blush Champagne Skin"],["luxury_champagne_gold_skin","Champagne Gold Skin"],["luxury_marble_bronze_skin","Marble Bronze Skin"],["royal_indigo_skin","Royal Indigo Skin"],["earth_luxury_skin","Earth Luxury Skin"]].map(([o,n])=>`<label style="display:flex;align-items:center;gap:8px;font-size:0.83rem;cursor:pointer;">
                                                <input type="checkbox" value="${o}"> ${n}
                                            </label>`).join("")}
                                    </div>
                                    ${this._adminSubFooter("_adminUnlockPremium","Unlock Selected")}
                                </div>

                                <!-- Sub: Send Message -->
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
            </div><!-- /modal -->`,document.body.appendChild(i.firstElementChild),document.getElementById("memberProfileModal").addEventListener("click",o=>{o.target.id==="memberProfileModal"&&this.close()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&this.state.isOpen&&this.close()})},_adminSubFooter(t,e){return`<div style="display:flex;gap:8px;">
            <button onclick="MemberProfileModal.${t}()"
                    style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                           font-size:0.88rem;font-weight:600;background:var(--neuro-accent);color:#fff;">
                ${e}
            </button>
            <button onclick="MemberProfileModal._closeAdminSubs()"
                    style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                           font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                           color:var(--neuro-text);">Cancel</button>
        </div>`},async open(t){var a,s;if(this.init(),!t)return;const e=t===((a=window.Core.state.currentUser)==null?void 0:a.id);this.state.currentUserId=t,this.state.isOpen=!0;const i=document.getElementById("memberProfileModal"),o=document.getElementById("memberProfileModalInner"),n=document.getElementById("memberModalLoading"),r=document.getElementById("memberModalContent");this._hideActionPanels(),n.style.display="block",r.style.display="none",i.style.display="flex",requestAnimationFrame(()=>{i.style.opacity="1",o.style.transform="translateY(0)"}),document.body.style.overflow="hidden";try{const l=await u.getProfile(t);if(!l){window.Core.showToast("Could not load member profile"),this.close();return}if(this._populate(l),!e){const m=u.subscribeToPresence(g=>{const f=g.find(C=>C.user_id===t);if(!f||!this.state.isOpen)return;const b=document.getElementById("memberModalStatusRing");if(!b)return;const M=this._STATUS_RINGS[f.status]||this._STATUS_RINGS.offline;b.style.borderColor=M.c,b.style.boxShadow=`0 0 0 3px ${M.s}`});this._presenceUnsub=()=>{try{m==null||m.unsubscribe()}catch{}}}const d=document.getElementById("memberModalActions"),c=document.getElementById("memberModalAppreciateBtn");d&&(d.style.display=e?"none":"flex"),c&&(c.style.display=e?"none":"block");const p=document.getElementById("memberModalAdminSection"),h=(s=window.Core.state.currentUser)==null?void 0:s.is_admin;if(p){if(p.style.display=h?"block":"none",h&&l.community_role){const b=document.getElementById("adminRoleSelect");b&&(b.value=l.community_role)}const m=document.getElementById("memberModalAdminBody"),g=document.getElementById("memberModalAdminToggle");m&&(m.style.display="none"),g&&(g.textContent="▶"),this._closeAdminSubs();const f=document.querySelector(`button[onclick*="_openAdminSub('role')"]`);f&&(f.style.display=e?"none":"inline-block")}e||(this.state.isAppreciated=!1,this.state.appreciationCount=0,this._updateAppreciateBtn(),Promise.all([u.getMyUserAppreciations(),u.getUserAppreciationCount(t)]).then(([m,g])=>{this.state.isAppreciated=m.has(t),this.state.appreciationCount=g,this._updateAppreciateBtn()}).catch(()=>{})),u.getUserProgress(t).then(m=>{m&&this._populateGamification(m)}).catch(()=>{}),this._loadMemberCommunityStats(t).catch(()=>{}),n.style.display="none",r.style.display="block"}catch(l){console.error("[MemberProfileModal] open error:",l),window.Core.showToast("Could not load member profile"),this.close()}},close(){const t=document.getElementById("memberProfileModal"),e=document.getElementById("memberProfileModalInner");t&&(t.style.opacity="0",e.style.transform="translateY(16px)",setTimeout(()=>{t.style.display="none",this.state.isOpen=!1,this.state.currentUserId=null,document.body.style.overflow="",this._hideActionPanels(),this._presenceUnsub&&(this._presenceUnsub(),this._presenceUnsub=null)},250))},_populate(t){const e=document.getElementById("memberModalAvatar");e&&(t.avatar_url?(e.style.background="transparent",e.innerHTML=`<img src="${t.avatar_url}" loading="lazy" decoding="async" width="80" height="80"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
                    alt="${this._esc(t.name)}">`):(e.style.background=window.Core.getAvatarGradient(t.id),e.innerHTML=`<span>${this._esc(t.emoji||(t.name||"?").charAt(0).toUpperCase())}</span>`));const i=document.getElementById("memberModalStatusRing");if(i){const r=this._STATUS_RINGS[t.community_status]||this._STATUS_RINGS.offline;i.style.borderColor=r.c,i.style.boxShadow=`0 0 0 3px ${r.s}`}this._setText("memberModalName",t.name||"Member"),this._setHTML("memberModalRole",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${t.community_role||"Member"}`),this._setText("memberModalInspiration",t.inspiration?`"${t.inspiration}"`:"");const o=document.getElementById("memberModalLocation"),n=document.getElementById("memberModalMetaSep");if(o){const r=[];if(t.birthday)try{const a=new Date(t.birthday+"T00:00:00");r.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${a.toLocaleDateString(void 0,{month:"long",day:"numeric"})}`)}catch{r.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${t.birthday}`)}t.country&&r.push(`${this._countryFlag(t.country)} ${t.country}`),r.length?(o.innerHTML=r.map((a,s)=>`${s>0?'<span style="width:1px;height:16px;background:rgba(0,0,0,0.1);flex-shrink:0;display:inline-block;"></span>':""}
                     <span style="font-size:0.76rem;font-weight:600;color:var(--text-muted);padding:5px 12px;white-space:nowrap;">${a}</span>`).join(""),n&&(n.style.display="")):(o.innerHTML="",n&&(n.style.display="none"))}},_populateGamification(t){const e=this._LEVEL_TITLES[t.level]||"Seeker",i=e.match(/^[aeiou]/i)?"An":"A",o=document.getElementById("memberModalLevel");o&&(o.textContent=`${i} ${e} - Level ${t.level}`);const n=document.getElementById("memberModalXpBar");if(n){const r=[0,800,2e3,4200,7e3,12e3,3e4,6e4,18e4,45e4],a=r[t.level-1]||0,s=r[t.level]||r[r.length-1],l=s>a?Math.min(100,Math.round((t.xp-a)/(s-a)*100)):100;requestAnimationFrame(()=>{n.style.width=l+"%"})}this._setText("memberModalXP",(t.xp??0).toLocaleString()),this._setText("memberModalKarma",(t.karma??0).toLocaleString()),this._setText("memberModalBadgeCount",(t.badges||[]).length)},async _loadMemberCommunityStats(t){if(!u.ready)return;const e=u._sb;try{const[i,o]=await Promise.all([e.from("room_blessings").select("*",{count:"exact",head:!0}).eq("user_id",t),e.from("room_entries").select("room_id").eq("user_id",t)]);this._setText("memberModalBlessings",!i.error&&i.count!=null?i.count.toLocaleString():"0");const n=o.data;if(!o.error&&(n!=null&&n.length)){const r={};for(const s of n)r[s.room_id]=(r[s.room_id]||0)+1;const a=Object.entries(r).sort((s,l)=>l[1]-s[1])[0][0];this._setText("memberModalFavRoom",a.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()))}else this._setText("memberModalFavRoom","-")}catch(i){console.warn("[MemberProfileModal] _loadMemberCommunityStats:",i)}},async toggleAppreciate(){const t=document.getElementById("memberModalAppreciateBtn");if(!(!t||!this.state.currentUserId)){t.disabled=!0;try{const e=await u.toggleUserAppreciation(this.state.currentUserId,this.state.isAppreciated);if(!e){window.Core.showToast("Could not update - please try again");return}this.state.isAppreciated=e.appreciated,this.state.appreciationCount=await u.getUserAppreciationCount(this.state.currentUserId),this._updateAppreciateBtn(),window.Core.showToast(e.appreciated?"Appreciation sent":"Appreciation removed")}catch(e){console.error("[MemberProfileModal] toggleAppreciate error:",e),window.Core.showToast("Could not update - please try again")}finally{t.disabled=!1}}},_updateAppreciateBtn(){const t=document.getElementById("memberModalAppreciateBtn");if(!t)return;const e=this.state.appreciationCount??"",i=e!==""?` (${e})`:"";this.state.isAppreciated?(t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciated${i}`,t.style.background="var(--primary,#667eea)",t.style.color="#fff",t.style.boxShadow="inset 2px 2px 5px rgba(0,0,0,0.15)"):(t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciate${i}`,t.style.background="var(--neuro-bg,#f0f0f3)",t.style.color="var(--neuro-text)",t.style.boxShadow="3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7)")},startWhisper(){var e;this._hideActionPanels();const t=document.getElementById("memberModalWhisperPanel");t&&(t.style.display="block",(e=document.getElementById("memberModalWhisperText"))==null||e.focus())},cancelWhisper(){const t=document.getElementById("memberModalWhisperPanel");if(!t)return;t.style.display="none";const e=document.getElementById("memberModalWhisperText");e&&(e.value="")},async sendWhisper(){const t=document.getElementById("memberModalWhisperText"),e=t==null?void 0:t.value.trim();if(!e){window.Core.showToast("Please write a message first");return}await this._withBtnState("#memberModalWhisperPanel button","Sending...","Send",async()=>{await u.sendWhisper(this.state.currentUserId,e)?(window.Core.showToast("Whisper sent"),this.cancelWhisper()):window.Core.showToast("Could not send - please try again")})},startReport(){this._hideActionPanels();const t=document.getElementById("memberModalReportPanel");t&&(t.style.display="block")},cancelReport(){const t=document.getElementById("memberModalReportPanel");if(!t)return;t.style.display="none";const e=document.getElementById("memberModalReportReason"),i=document.getElementById("memberModalReportDetails");e&&(e.value=""),i&&(i.value="")},async submitReport(){var i,o;const t=(i=document.getElementById("memberModalReportReason"))==null?void 0:i.value,e=((o=document.getElementById("memberModalReportDetails"))==null?void 0:o.value.trim())||"";if(!t){window.Core.showToast("Please select a reason");return}await this._withBtnState("#memberModalReportPanel button","Submitting...","Submit Report",async()=>{await u.submitReport(this.state.currentUserId,t,e)?(window.Core.showToast("Report submitted - thank you"),this.cancelReport()):window.Core.showToast("Could not submit - please try again")})},async startBlock(){var e,i;const t=((e=document.getElementById("memberModalName"))==null?void 0:e.textContent)||"this member";if(confirm(`Block ${t}? Their content will be hidden from you.`))try{await u.blockUser(this.state.currentUserId)?(window.Core.showToast(`${t} blocked`),this.close(),(i=window.ActiveMembers)==null||i.refresh()):window.Core.showToast("Could not block - please try again")}catch(o){console.error("[MemberProfileModal] blockUser error:",o),window.Core.showToast("Could not block - please try again")}},_toggleAdminPanel(){const t=document.getElementById("memberModalAdminBody"),e=document.getElementById("memberModalAdminToggle");if(!t)return;const i=t.style.display!=="none";t.style.display=i?"none":"block",e.textContent=i?"▶":"▼",i&&this._closeAdminSubs()},_openAdminSub(t){this._closeAdminSubs();const e=t.charAt(0).toUpperCase()+t.slice(1),i=document.getElementById(`adminSub${e}`);i&&(i.style.display="block")},_closeAdminSubs(){for(const t of this._ADMIN_SUB_IDS){const e=document.getElementById(t);e&&(e.style.display="none")}},async _adminChangeRole(){var e;const t=(e=document.getElementById("adminRoleSelect"))==null?void 0:e.value;!t||!this.state.currentUserId||await this._withBtnState("#adminSubRole button","Saving...","Save Role",async()=>{const i={community_role:t};i.is_vip=t==="VIP",i.is_admin=t==="Admin";const{error:o}=await u._sb.rpc("admin_update_profile",{target_user_id:this.state.currentUserId,new_role:i.community_role,new_is_vip:i.is_vip,new_is_admin:i.is_admin});if(o)throw o;this._setHTML("memberModalRole",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${t}`),await this._adminPushNotify(this.state.currentUserId,"👤 Role Updated",`Your community role has been changed to ${t}.`),window.Core.showToast(`Role changed to ${t}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendXP(){var e;const t=parseInt((e=document.getElementById("adminXpAmount"))==null?void 0:e.value,10);if(!t||t<1){window.Core.showToast("Enter a valid XP amount");return}await this._withBtnState("#adminSubXp button","Sending...","Send XP",async()=>{if(!await u.adminUpdateGamification(this.state.currentUserId,{xpDelta:t}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎁 Gift from Aanandoham!",`You received +${t} XP!`),window.Core.showToast(`Sent ${t} XP`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendKarma(){var e;const t=parseInt((e=document.getElementById("adminKarmaAmount"))==null?void 0:e.value,10);if(!t||t<1){window.Core.showToast("Enter a valid Karma amount");return}await this._withBtnState("#adminSubKarma button","Sending...","Send Karma",async()=>{if(!await u.adminUpdateGamification(this.state.currentUserId,{karmaDelta:t}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎁 Gift from Aanandoham!",`You received +${t} Karma!`),window.Core.showToast(`Sent ${t} Karma`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendBadge(){const t=document.getElementById("adminBadgeSelect"),e=t==null?void 0:t.selectedOptions[0];if(!e)return;const o=(window.BADGE_REGISTRY||[]).find(r=>r.id===e.value)||{},n={id:e.value,name:o.name||e.textContent.replace(/^.+? /,"").trim(),icon:o.icon||e.dataset.icon||"🏅",rarity:o.rarity||e.dataset.rarity||"common",xp:o.xp??parseInt(e.dataset.xp,10)??0,description:o.desc||e.dataset.desc||""};await this._withBtnState("#adminSubBadge button","Awarding...","Award Badge",async()=>{if(!await u.adminUpdateGamification(this.state.currentUserId,{badgeId:n.id,badgeName:n.name,badgeIcon:n.icon,badgeRarity:n.rarity,badgeXp:n.xp,badgeDesc:n.description}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎖️ New Badge Earned!",`You received the ${n.name} badge!`),window.Core.showToast(`Awarded ${n.icon} ${n.name}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendCustomBadge(){var s,l,d,c,p,h;const t=((s=document.getElementById("adminCustomBadgeIcon"))==null?void 0:s.value.trim())||"🏅",e=(l=document.getElementById("adminCustomBadgeName"))==null?void 0:l.value.trim(),i=((d=document.getElementById("adminCustomBadgeDesc"))==null?void 0:d.value.trim())||"",o=((c=document.getElementById("adminCustomBadgeRarity"))==null?void 0:c.value)||"epic",n=parseInt((p=document.getElementById("adminCustomBadgeXp"))==null?void 0:p.value,10)||0,r=parseInt((h=document.getElementById("adminCustomBadgeKarma"))==null?void 0:h.value,10)||0;if(!e){window.Core.showToast("Please enter a badge name");return}const a="custom_"+e.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")+"_"+Date.now();await this._withBtnState("#adminSubCustomBadge button","Awarding...","Award Custom Badge",async()=>{if(!await u.adminUpdateGamification(this.state.currentUserId,{badgeId:a,badgeName:e,badgeIcon:t,badgeRarity:o,badgeXp:n,badgeDesc:i}))throw new Error("Save failed");r>0&&await u.adminUpdateGamification(this.state.currentUserId,{karmaDelta:r}),await this._adminPushNotify(this.state.currentUserId,"🎖️ Special Badge Earned!",`You received the ${e} badge!`),window.Core.showToast(`Awarded custom badge: ${t} ${e}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminUnlockPremium(){const t=[...document.querySelectorAll("#adminSubPremium input[type=checkbox]:checked")].map(e=>e.value);if(!t.length){window.Core.showToast("Select at least one feature");return}await this._withBtnState("#adminSubPremium button","Unlocking...","Unlock Selected",async()=>{let e=0;const i=[];for(const n of t)await u.adminUpdateGamification(this.state.currentUserId,{unlockFeature:n})?e++:i.push(n);if(i.length&&console.warn("[AdminPanel] Failed to unlock:",i),!e)throw new Error("All unlocks failed");const o=t.map(n=>n.replace(/_/g," ").replace(/\b\w/g,r=>r.toUpperCase())).join(", ");await this._adminPushNotify(this.state.currentUserId,"🔓 New Features Unlocked!",`Admin unlocked: ${o}`),window.Core.showToast(`Unlocked ${e}/${t.length} feature(s)${i.length?` (${i.length} failed)`:""}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendMessage(){var i,o;const t=(i=document.getElementById("adminMessageTitle"))==null?void 0:i.value.trim(),e=(o=document.getElementById("adminMessageContent"))==null?void 0:o.value.trim();if(!t){window.Core.showToast("Please enter a message title");return}if(!e){window.Core.showToast("Please enter a message");return}await this._withBtnState("#adminSubMessage button","Sending...","Send Message",async()=>{const{data:n}=await u._sb.from("user_progress").select("payload").eq("user_id",this.state.currentUserId).single(),r=(n==null?void 0:n.payload)||{},a=r.adminMessages||[];a.push({id:Date.now()+Math.random(),title:t,content:e,date:new Date().toISOString(),read:!1});const{error:s}=await u._sb.from("user_progress").update({payload:{...r,adminMessages:a},updated_at:new Date().toISOString()}).eq("user_id",this.state.currentUserId);if(s)throw s;const l=e.length>80?e.slice(0,80)+"...":e;await this._adminPushNotify(this.state.currentUserId,`💬 ${t}`,l),window.Core.showToast("Message sent"),this._closeAdminSubs(),document.getElementById("adminMessageTitle").value="",document.getElementById("adminMessageContent").value=""})},async _safeRefresh(t){var o,n,r,a,s,l,d,c,p;const e=(o=window.Core.state.currentUser)==null?void 0:o.id;if(t===e){const h=(n=window.app)==null?void 0:n.gamification;h!=null&&h.saveTimeout&&(clearTimeout(h.saveTimeout),h.saveTimeout=null),(a=(r=window.DB)==null?void 0:r.clearCache)==null||a.call(r),(d=(l=(s=window.app)==null?void 0:s.state)==null?void 0:l.clearCache)==null||d.call(l);try{const m=await u.getUserProgress(t);m&&(h!=null&&h.state)&&(m.xp!==void 0&&(h.state.xp=m.xp),m.karma!==void 0&&(h.state.karma=m.karma),m.level!==void 0&&(h.state.level=m.level),Array.isArray(m.badges)&&(h.state.badges=m.badges),Array.isArray(m.unlockedFeatures)&&(h.state.unlockedFeatures=m.unlockedFeatures)),m&&((p=(c=window.app)==null?void 0:c.state)!=null&&p.data)&&(m.xp!==void 0&&(window.app.state.data.xp=m.xp),m.karma!==void 0&&(window.app.state.data.karma=m.karma),m.level!==void 0&&(window.app.state.data.level=m.level),Array.isArray(m.badges)&&(window.app.state.data.badges=m.badges),Array.isArray(m.unlockedFeatures)&&(window.app.state.data.unlockedFeatures=m.unlockedFeatures))}catch(m){console.warn("[_safeRefresh] pre-patch failed:",m)}}await this._refreshMainProfileStats(t)},async _refreshMainProfileStats(t){var e,i,o,n,r,a;try{const s=(e=window.Core.state.currentUser)==null?void 0:e.id;if(!s)return;const l=t||s,d=await u.getUserProgress(l);if(!d)return;if(l===s){d.xp!==void 0&&(window.Core.state.currentUser.xp=d.xp),d.karma!==void 0&&(window.Core.state.currentUser.karma=d.karma),d.level!==void 0&&(window.Core.state.currentUser.level=d.level),await((n=(o=(i=window.app)==null?void 0:i.gamification)==null?void 0:o.reloadFromDatabase)==null?void 0:n.call(o));const c=document.getElementById("profileGamificationXP");c&&d.xp!==void 0&&(c.textContent=d.xp.toLocaleString()),(a=(r=window.ProfileModule)==null?void 0:r.refreshGamification)==null||a.call(r)}this._populateGamification(d)}catch(s){console.warn("[AdminPanel] _refreshMainProfileStats:",s)}},async _adminPushNotify(t,e,i){try{const o=await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:t,payload:{title:e,body:i,icon:"/icons/icon-192x192.png",data:{url:"/"}}})});o.ok||console.warn(`[MemberProfileModal] push notify non-200: ${o.status}`)}catch(o){console.warn("[MemberProfileModal] push notify unavailable:",o.message)}},_hideActionPanels(){["memberModalWhisperPanel","memberModalReportPanel"].forEach(o=>{const n=document.getElementById(o);n&&(n.style.display="none")});const t=document.getElementById("memberModalWhisperText");t&&(t.value="");const e=document.getElementById("memberModalReportReason"),i=document.getElementById("memberModalReportDetails");e&&(e.value=""),i&&(i.value=""),this._closeAdminSubs()},_setText(t,e){const i=document.getElementById(t);i&&(i.textContent=e)},_setHTML(t,e){const i=document.getElementById(t);i&&(i.innerHTML=e)},async _withBtnState(t,e,i,o){const n=document.querySelector(t);n&&(n.disabled=!0,n.textContent=e);try{await o()}catch(r){console.error(`[AdminPanel] ${i} error:`,r),window.Core.showToast(`Could not complete: ${i}`)}finally{n&&(n.disabled=!1,n.textContent=i)}},_countryFlag(t){const e=this._COUNTRY_CODES[t.toLowerCase().trim()];return e?[...e].map(i=>String.fromCodePoint(127462+i.charCodeAt(0)-65)).join(""):"🌍"},_esc(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}};window.MemberProfileModal=vt;const xt={state:{isOpen:!1,view:"inbox",threadPartnerId:null,threadPartnerName:null,realtimeSub:null,bgSub:null,readPartnerIds:new Set},init(){if(document.getElementById("whisperModal"))return;const t=document.createElement("div");t.innerHTML=`
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

                        <!-- View switcher pill (only visible in thread view) -->
                        <button id="whisperBackBtn"
                                onclick="WhisperModal._showInbox()"
                                aria-label="All conversations"
                                style="display:none;background:var(--neuro-bg);border:1px solid rgba(0,0,0,0.1);
                                       border-radius:99px;padding:5px 14px;font-size:0.78rem;font-weight:600;
                                       color:var(--text-muted);cursor:pointer;white-space:nowrap;
                                       transition:background 0.15s,color 0.15s;">
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
                            <div style="font-size:0.95rem;font-weight:600;color:var(--neuro-text);margin-bottom:6px;">
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
                             style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading messages...
                        </div>
                        <div id="whisperThreadMessages" style="display:flex;flex-direction:column;gap:10px;"></div>
                    </div>

                    <!-- Reply bar (thread view only) -->
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
                                             resize:none;background:var(--neuro-bg);color:var(--neuro-text);
                                             box-sizing:border-box;font-family:inherit;
                                             box-shadow:inset 2px 2px 5px rgba(0,0,0,0.06);
                                             transition:border-color 0.15s;outline:none;"
                                      onfocus="this.style.borderColor='var(--neuro-accent)'"
                                      onblur="this.style.borderColor='rgba(0,0,0,0.10)'"></textarea>
                            <button id="whisperReplyBtn" onclick="WhisperModal._sendReply()"
                                    style="padding:12px 20px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-accent,#6b9b37);color:#fff;
                                           white-space:nowrap;align-self:flex-end;
                                           box-shadow:3px 3px 8px rgba(0,0,0,0.12);
                                           transition:opacity 0.15s,transform 0.15s;"
                                    onmouseover="this.style.opacity='0.88';this.style.transform='translateY(-1px)'"
                                    onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">
                                Send
                            </button>
                        </div>
                        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:6px;text-align:right;">
                            ⌘ + Enter to send
                        </div>
                    </div>
                </div>
            </div>`,document.body.appendChild(t.firstElementChild),document.getElementById("whisperModal").addEventListener("click",i=>{i.target.id==="whisperModal"&&this.close()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&this.state.isOpen&&this.close()});const e=()=>{u!=null&&u.ready?this.startBackgroundListener():setTimeout(e,500)};e()},async open(){this._openShared(),await this._showInbox()},async openThread(t,e,i,o){this._openShared(),await this._showThread(t,e,i,o)},_openShared(){this.init(),this._animateIn(),this.state.isOpen=!0,document.body.style.overflow="hidden",this._subscribeRealtime()},close(){const t=document.getElementById("whisperModal"),e=document.getElementById("whisperModalInner");t&&(t.style.opacity="0",e.style.transform="translateY(20px)",setTimeout(()=>{var i,o;t.style.display="none",this.state.isOpen=!1,this.state.view="inbox",this.state.threadPartnerId=null,document.body.style.overflow="",(o=(i=this.state.realtimeSub)==null?void 0:i.unsubscribe)==null||o.call(i),this.state.realtimeSub=null},250))},_animateIn(){const t=document.getElementById("whisperModal"),e=document.getElementById("whisperModalInner");t.style.display="flex",requestAnimationFrame(()=>{t.style.opacity="1",e.style.transform="translateY(0)"})},_setView(t){const e=t==="inbox";document.getElementById("whisperInboxView").style.display=e?"block":"none",document.getElementById("whisperThreadView").style.display=e?"none":"flex",document.getElementById("whisperReplyBar").style.display=e?"none":"block",document.getElementById("whisperBackBtn").style.display=e?"none":"inline-flex";const i=document.getElementById("whisperModalSubtitle");e&&(document.getElementById("whisperModalTitle").textContent="Whispers",i.style.display="none")},async _showInbox(){this.state.view="inbox",this.state.threadPartnerId=null,this._setView("inbox");const t=document.getElementById("whisperInboxLoading"),e=document.getElementById("whisperInboxEmpty"),i=document.getElementById("whisperInboxList");t.style.display="block",e.style.display="none",i.innerHTML="";const o=await u.getWhisperInbox();if(t.style.display="none",!o.length){e.style.display="block";return}o.forEach(n=>{var r;this.state.readPartnerIds.has((r=n.partner)==null?void 0:r.id)&&(n.unread=0)}),i.innerHTML=o.map(n=>this._conversationRowHTML(n)).join(""),this._setBadge(o.reduce((n,r)=>n+r.unread,0))},_conversationRowHTML(t){const e=t.partner||{},i=this._escape(e.name||"Member"),o=this._avatarHTML(e,44),n=this._escape(t.lastMessage||""),r=this._relativeTime(t.lastAt),a=this._escape(e.id||""),s=this._escape(e.emoji||""),l=this._escape(e.avatar_url||""),d=t.unread>0;return`
            <div data-partner-id="${a}"
                 onclick="WhisperModal._showThread('${a}','${i}','${s}','${l}')"
                 style="display:flex;align-items:center;gap:14px;
                        padding:0.9rem 1.75rem;cursor:pointer;
                        transition:background 0.15s;
                        border-bottom:1px solid rgba(0,0,0,0.04);"
                 onmouseover="this.style.background='rgba(0,0,0,0.03)'"
                 onmouseout="this.style.background='transparent'">

                <div style="position:relative;flex-shrink:0;">
                    ${o}
                    ${d?`<span style="position:absolute;top:-2px;right:-2px;
                        width:10px;height:10px;border-radius:50%;
                        background:var(--neuro-accent);border:2px solid var(--neuro-bg);"></span>`:""}
                </div>

                <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:3px;">
                        <span class="whisper-partner-name"
                              style="font-weight:${d?"700":"500"};font-size:0.9rem;
                                     color:var(--neuro-text);white-space:nowrap;
                                     overflow:hidden;text-overflow:ellipsis;">
                            ${i}
                        </span>
                        <span style="font-size:0.7rem;color:var(--text-muted);flex-shrink:0;">${r}</span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);
                                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                                font-weight:${d?"600":"400"};">
                        ${n}
                    </div>
                </div>

                ${d?`<span class="whisper-unread-badge"
                    style="background:var(--neuro-accent);color:#fff;border-radius:99px;
                           font-size:0.68rem;font-weight:700;padding:2px 8px;
                           min-width:20px;text-align:center;flex-shrink:0;">
                    ${t.unread}
                </span>`:'<span class="whisper-unread-badge" style="display:none;"></span>'}
            </div>`},async _showThread(t,e,i,o){var c;this.state.view="thread",this.state.threadPartnerId=t,this.state.threadPartnerName=e,this._setView("thread"),document.getElementById("whisperModalTitle").textContent=e;const n=document.getElementById("whisperModalSubtitle");n.textContent="Private whisper thread",n.style.display="block";const r=document.getElementById("whisperThreadLoading"),a=document.getElementById("whisperThreadMessages"),s=document.getElementById("whisperThreadView");r.style.display="block",a.innerHTML="",this.state.readPartnerIds.add(t);const[l]=await Promise.all([u.getWhispers(t),u.markConversationRead(t).then(p=>console.log("[Whisper] markConversationRead result:",p)).catch(p=>console.error("[Whisper] markConversationRead error:",p))]);r.style.display="none",this._renderThreadMessages(l),setTimeout(()=>{s.scrollTop=s.scrollHeight},50),(c=document.getElementById("whisperReplyText"))==null||c.focus(),this._clearInboxRowUnread(t);const d=await u.getUnreadWhisperCount().catch(()=>null);console.log("[Whisper] getUnreadWhisperCount after read:",d),d!==null&&this._setBadge(d)},_clearInboxRowUnread(t){const e=document.querySelector(`#whisperInboxList [data-partner-id="${t}"]`);if(!e)return;e.querySelectorAll("span").forEach(a=>{a.style.position==="absolute"&&a.remove()});const i=e.querySelector(".whisper-unread-badge");i&&(i.style.display="none");const o=e.querySelector(".whisper-partner-name");o&&(o.style.fontWeight="500");const n=o==null?void 0:o.closest('div[style*="justify-content"]'),r=n==null?void 0:n.nextElementSibling;r&&(r.style.fontWeight="400")},_renderThreadMessages(t){const e=document.getElementById("whisperThreadMessages");if(!e)return;if(!t.length){e.innerHTML=`
                <div style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.85rem;">
                    No messages yet — say something ✨
                </div>`;return}const i=u._uid;e.innerHTML=t.map(o=>{var r;const n=o.sender_id===i||((r=o.sender)==null?void 0:r.id)===i;return this._messageBubbleHTML(n,this._escape(o.message),this._relativeTime(o.created_at))}).join("")},_appendMessage(t){var r,a;const e=document.getElementById("whisperThreadMessages");if(!e)return;(r=e.querySelector("[data-empty]"))==null||r.remove();const i=u._uid,o=t.sender_id===i,n=document.createElement("div");n.innerHTML=this._messageBubbleHTML(o,this._escape(t.message),this._relativeTime(t.created_at)),e.appendChild(n.firstElementChild),(a=document.getElementById("whisperThreadView"))==null||a.scrollTo({top:999999})},_messageBubbleHTML(t,e,i){return`
            <div style="display:flex;flex-direction:column;
                        align-items:${t?"flex-end":"flex-start"};gap:3px;">
                <div style="max-width:75%;padding:10px 14px;
                            border-radius:${t?"18px 18px 4px 18px":"18px 18px 18px 4px"};
                            background:${t?"var(--neuro-accent,#6b9b37)":"rgba(0,0,0,0.06)"};
                            color:${t?"#fff":"var(--neuro-text)"};
                            font-size:0.9rem;line-height:1.5;word-break:break-word;
                            box-shadow:${t?"2px 3px 8px rgba(0,0,0,0.12)":"inset 1px 1px 4px rgba(0,0,0,0.05)"};">
                    ${e}
                </div>
                <span style="font-size:0.68rem;color:var(--text-muted);padding:0 4px;">${i}</span>
            </div>`},async _sendReply(){const t=document.getElementById("whisperReplyText"),e=t==null?void 0:t.value.trim();if(!e||!this.state.threadPartnerId)return;const i=document.getElementById("whisperReplyBtn");i&&(i.disabled=!0,i.textContent="…"),t.disabled=!0;try{await u.sendWhisper(this.state.threadPartnerId,e)?(t.value="",this._appendMessage({sender_id:u._uid,message:e,created_at:new Date().toISOString()})):window.Core.showToast("Could not send — please try again")}catch(o){console.error("[WhisperModal] sendReply error:",o),window.Core.showToast("Could not send — please try again")}finally{i&&(i.disabled=!1,i.textContent="Send"),t.disabled=!1,t.focus()}},_replyKeydown(t){t.key==="Enter"&&(t.metaKey||t.ctrlKey)&&(t.preventDefault(),this._sendReply())},_subscribeRealtime(){var t,e;(e=(t=this.state.realtimeSub)==null?void 0:t.unsubscribe)==null||e.call(t),this.state.realtimeSub=u.subscribeToWhispers(i=>{var o;this.state.view==="thread"&&i.sender_id===this.state.threadPartnerId?(this._appendMessage(i),u.markConversationRead(i.sender_id).catch(()=>{})):(window.Core.showToast(`New whisper from ${((o=i.sender)==null?void 0:o.name)||"Someone"}`),this.state.view==="inbox"?this._showInbox():this.refreshUnreadBadge())})},async refreshUnreadBadge(){this._setBadge(await u.getUnreadWhisperCount())},_setBadge(t){const e=document.getElementById("whisperUnreadBadge");e&&(e.textContent=t>99?"99+":t,e.style.display=t>0?"inline-flex":"none")},startBackgroundListener(){this.state.bgSub||u!=null&&u.ready&&(this.refreshUnreadBadge().catch(()=>{}),this.state.bgSub=u.subscribeToWhispersBackground(t=>{this.state.isOpen&&this.state.view==="thread"&&t.sender_id===this.state.threadPartnerId||this.refreshUnreadBadge().catch(()=>{})}))},_avatarHTML(t,e=44){const i=e+"px";if(t!=null&&t.avatar_url)return`<img src="${t.avatar_url}"
                         width="${e}" height="${e}" loading="lazy" decoding="async"
                         style="width:${i};height:${i};border-radius:50%;object-fit:cover;display:block;"
                         alt="${this._escape(t.name||"")}">`;const o=window.Core.getAvatarGradient((t==null?void 0:t.id)||""),n=(t==null?void 0:t.emoji)||((t==null?void 0:t.name)||"?").charAt(0).toUpperCase();return`<div style="width:${i};height:${i};border-radius:50%;background:${o};
                            display:flex;align-items:center;justify-content:center;
                            font-size:${Math.round(e*.42)}px;flex-shrink:0;
                            box-shadow:2px 2px 6px rgba(0,0,0,0.1);">
                    ${this._escape(n)}
                </div>`},_relativeTime(t){if(!t)return"";const e=Date.now()-new Date(t).getTime(),i=Math.floor(e/6e4);if(i<1)return"just now";if(i<60)return`${i}m ago`;const o=Math.floor(i/60);if(o<24)return`${o}h ago`;const n=Math.floor(o/24);return n<7?`${n}d ago`:new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})},_escape(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}};window.WhisperModal=xt;const ae={_instances:new Set,_subscribed:!1,_retryTimer:null,_blockedCache:null,register(t){this._instances.add(t),this._subscribed||this._subscribe()},unregister(t){this._instances.delete(t),this._instances.size===0&&(this._unsubscribe(),this._blockedCache=null)},async getBlocked(){return this._blockedCache||(this._blockedCache=u.getBlockedUsers().catch(()=>new Set)),this._blockedCache},invalidateBlocked(){this._blockedCache=null},_subscribe(){if(!u.ready){this._retryTimer=setInterval(()=>{u.ready&&(clearInterval(this._retryTimer),this._retryTimer=null,this._doSubscribe())},300);return}this._doSubscribe()},_doSubscribe(){const t=u.subscribeToPresence(async e=>{const i=await this.getBlocked(),o=e.filter(n=>!i.has(n.user_id));this._instances.forEach(n=>n._onPresenceUpdate(o))});this._subscribed=!!t},_unsubscribe(){clearInterval(this._retryTimer),this._retryTimer=null,this._subscribed=!1}},wt=new Set(["online","available","away","guiding","silent","deep","offline"]),at={online:"online",available:"online",away:"away",guiding:"away",silent:"silent",deep:"deep",offline:"offline"},_t=1e4,kt=150;class Ct{constructor(e){if(!(e instanceof HTMLElement))throw new TypeError("[ActiveMembersWidget] containerEl must be an HTMLElement");this.container=e,this.isRendered=!1,this._destroyed=!1}render(){this.container.innerHTML=this._buildShell("Loading..."),this._waitForDB().then(()=>Promise.all([u.getActiveMembers(),ae.getBlocked()])).then(([e,i])=>{if(this._destroyed)return;const o=e.filter(n=>!i.has(n.user_id));this._paint(o),ae.register(this),this.isRendered=!0}).catch(e=>{this._destroyed||(console.error("[ActiveMembersWidget] render error:",e),this.container.innerHTML=this._buildShell("Could not load members."))})}async refresh(){this.isRendered=!1,this.render()}updateMemberStatus(e,i){if(!wt.has(i))return;const o=this.container.querySelector(`[data-member-id="${e}"]`),n=o==null?void 0:o.querySelector(".member-mini-status");n&&(["online","away","offline","silent","deep"].forEach(r=>n.classList.remove(r)),n.classList.add(at[i]||"offline"),n.setAttribute("aria-label",i),n.setAttribute("title",st(i)))}updateMemberActivity(e,i){if(!i||typeof i!="string")return;const o=this.container.querySelector(`[data-member-id="${e}"] .member-mini-info`);o&&(o.textContent=i)}updateMemberAvatar(e,{emoji:i,avatarUrl:o}={}){const n=this.container.querySelector(`[data-member-id="${e}"]`),r=n==null?void 0:n.querySelector(".member-mini-avatar");r&&(o?(r.style.background="transparent",r.innerHTML=`<img src="${o}"
                style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                alt="" loading="lazy" decoding="async">`):i&&(r.style.background="",r.innerHTML=`<span class="member-avatar-icon">${De(i)}</span>`))}destroy(){this._destroyed=!0,ae.unregister(this),this.isRendered=!1}_waitForDB(){return u.ready?Promise.resolve():new Promise((e,i)=>{const o=Date.now(),n=setInterval(()=>{this._destroyed?(clearInterval(n),i(new Error("widget destroyed"))):u.ready?(clearInterval(n),e()):Date.now()-o>_t&&(clearInterval(n),i(new Error("CommunityDB not ready after timeout")))},kt)})}_onPresenceUpdate(e){this._paint(e)}_paint(e){const i=e.filter(r=>r.status==="online"||r.status==="available").length,o=this.container.querySelector(".active-members-online-count"),n=this.container.querySelector(".active-members-grid");o&&n?(o.textContent=`${i} online`,n.innerHTML=Ge(e)):this.container.innerHTML=this._buildShell(`${i} online`,e)}_buildShell(e,i=null){const o=i===null?"":`
            <div class="active-members-grid">
                ${Ge(i)}
            </div>
            <button type="button" onclick="window.WhisperModal?.open()"
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
                         style="font-size:12px;color:var(--text-muted);">${e}</div>
                </div>
                ${o}
            </section>`}get _uid(){return this.__uid||(this.__uid=Math.random().toString(36).slice(2,7)),this.__uid}}function Ge(t){return t!=null&&t.length?t.map(Mt).join(""):'<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online</div>'}function Mt(t){var h;if(!t)return"";const e=t.profiles||{},i=e.name||"Member",o=e.emoji||"",n=e.avatar_url||"",r=t.status||"online",a=t.activity||"✨ Available",s=t.user_id,l=(h=window.Core)==null?void 0:h.getAvatarGradient(s||i),d=$e(i),c=at[r]||"offline",p=n?`<img src="${n}"
               style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
               alt="${d}" loading="lazy">`:o?`<span class="member-avatar-icon">${De(o)}</span>`:`<span>${$e(i.charAt(0).toUpperCase())}</span>`;return`
        <div class="member-card-mini"
             onclick="window._activeMembersHandleView('${s}')"
             data-member-id="${s}"
             role="button"
             tabindex="0"
             aria-label="View ${d}'s profile"
             onkeydown="if(event.key==='Enter'||event.key===' '){
                 event.preventDefault();
                 window._activeMembersHandleView('${s}');
             }">
            <div class="member-mini-avatar"
                 style="${n?"background:transparent;":`background:${l};`}"
                 aria-hidden="true">
                ${p}
            </div>
            <div class="member-mini-status ${c}"
                 aria-label="${r}"
                 title="${st(r)}"></div>
            <div class="member-mini-name">${d}</div>
            <div class="member-mini-info">${$e(a)}</div>
        </div>`}function $e(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}function st(t){return!t||typeof t!="string"?"":t.charAt(0).toUpperCase()+t.slice(1)}window._activeMembersHandleView=function(t){var e;t&&(window.MemberProfileModal?window.MemberProfileModal.open(t):(e=window.Core)==null||e.showToast("Member profiles loading..."))};window.addEventListener("avatarChanged",t=>{const{userId:e,emoji:i,avatarUrl:o}=t.detail||{};e&&ae._instances.forEach(n=>{n.updateMemberAvatar(e,{emoji:i,avatarUrl:o})})});window.ActiveMembers={async render(){ae._instances.size>0&&ae._instances.forEach(t=>t.refresh())},updateMemberStatus(t,e){ae._instances.forEach(i=>i.updateMemberStatus(t,e))},updateMemberActivity(t,e){ae._instances.forEach(i=>i.updateMemberActivity(t,e))},async refresh(){ae._instances.forEach(t=>t.refresh())},get state(){return{isRendered:ae._instances.size>0}}};const St={state:{hasSeenOpening:!1,isInitialized:!1,autoCloseTimer:null},config:{OPENING_AUTO_CLOSE_MS:5e3,CLOSING_AUTO_CLOSE_MS:3e3,OPENING_COOLDOWN_MS:1440*60*1e3,OPENING_TEXTS:["Enter with intention, leave with gratitude","This space holds you. Enter with presence.","Breathe in. You are welcome here.","Leave the noise behind. Step into stillness.","You are exactly where you need to be.","Enter gently. This moment is yours.","Set down what you carry. Enter with an open heart.","The space is ready. So are you.","Come as you are. This is a place of welcome.","Arrive fully. Begin with intention."],CLOSING_TEXTS:["Thank you for holding space with us","Carry the stillness with you as you go.","You showed up. That is enough.","May what was planted here continue to grow.","Go gently. You have done something meaningful.","The practice continues beyond this space.","Thank you for your presence in this circle.","Rest in what was received here today.","You are changed by having paused. Go well.","Until next time - carry the quiet with you."],ROOM_MODULES:["BreathworkRoom","SilentRoom","GuidedRoom","OshoRoom","DeepWorkRoom","CampfireRoom","TarotRoom","ReikiRoom","NewMoonRoom","WaxingMoonRoom","FullMoonRoom","WaningMoonRoom","SpringSolarRoom","SummerSolarRoom","AutumnSolarRoom","WinterSolarRoom"]},init(){if(this.state.isInitialized){console.warn("Rituals already initialized");return}try{this.loadState(),this.setupEventListeners(),this.state.isInitialized=!0}catch(t){console.error("Rituals initialization failed:",t)}},setupEventListeners(){document.addEventListener("keydown",t=>{if(t.key!=="Escape")return;const e=document.getElementById("openingOverlay"),i=document.getElementById("closingOverlay");e!=null&&e.classList.contains("active")?this.completeOpening():i!=null&&i.classList.contains("active")&&this.completeClosing()}),document.addEventListener("click",t=>{var i;const e=(i=t.target.closest("[data-action]"))==null?void 0:i.dataset.action;e==="ritual-opening"?this.completeOpening():e==="ritual-closing"&&this.completeClosing()})},loadState(){try{const t=localStorage.getItem("rituals_lastSeen");if(t){const e=Date.now()-parseInt(t,10);this.state.hasSeenOpening=e<this.config.OPENING_COOLDOWN_MS}}catch(t){console.error("Failed to load rituals state:",t)}},saveState(){try{localStorage.setItem("rituals_lastSeen",Date.now().toString())}catch(t){console.error("Failed to save rituals state:",t)}},completeOpening(){var e;const t=document.getElementById("openingOverlay");t&&(clearTimeout(this.state.autoCloseTimer),this.state.autoCloseTimer=null,t.classList.remove("active"),document.body.classList.remove("ritual-active"),this.state.hasSeenOpening=!0,this.saveState(),(e=w==null?void 0:w.showToast)==null||e.call(w,"Welcome to the space"))},showClosing(){const t=document.getElementById("closingOverlay"),e=document.getElementById("communityHubFullscreenContainer");if(!t){console.warn("Closing overlay not found");return}const i=document.getElementById("closingRitualText");i&&(i.textContent=`"${this._randomText("CLOSING_TEXTS")}"`),document.body.classList.add("ritual-active"),e&&(e.style.display="block",e.style.pointerEvents="auto"),t.classList.add("active"),t.setAttribute("aria-hidden","false");const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches?1e3:this.config.CLOSING_AUTO_CLOSE_MS;this.state.autoCloseTimer=setTimeout(()=>this.completeClosing(),n)},completeClosing(){var i,o;const t=document.getElementById("closingOverlay"),e=document.getElementById("communityHubFullscreenContainer");if(!t){console.warn("Closing overlay not found");return}t.classList.remove("active"),t.setAttribute("aria-hidden","true"),document.body.classList.remove("ritual-active"),document.body.style.overflow="",clearTimeout(this.state.autoCloseTimer),this.state.autoCloseTimer=null,e&&(e.style.display="none"),this.cleanupActiveRoom(),(i=w==null?void 0:w.navigateTo)==null||i.call(w,"hubView"),(o=w==null?void 0:w.showToast)==null||o.call(w,"Space closed with gratitude")},cleanupActiveRoom(){const t=this.findActiveRoom();if(!t)return;const{module:e,name:i}=t;typeof e.leaveRoom=="function"?e.leaveRoom():typeof e.cleanup=="function"&&e.cleanup()},findActiveRoom(){if(window.currentSolarRoom)return{name:"CurrentSolarRoom",module:window.currentSolarRoom};if(window.currentLunarRoom)return{name:"CurrentLunarRoom",module:window.currentLunarRoom};const t=document.getElementById("dynamicRoomContent"),e=(t==null?void 0:t.children.length)>0,i=!!document.querySelector(".ps-header");if(!e||!i)return null;for(const o of this.config.ROOM_MODULES){const n=window[o];if(!(n!=null&&n.roomId))continue;const{roomId:r}=n;if(document.getElementById(`${r}ParticipantStack`)||document.getElementById(`${r}View`)||document.getElementById(`${r}TimerDisplay`))return{name:o,module:n}}return null},getRoomViewId(t,e){return t.roomId?`${t.roomId}PracticeView`:t.viewId?t.viewId:`${e.toLowerCase().replace("room","")}PracticeView`},_randomText(t){const e=this.config[t];return e[Math.floor(Math.random()*e.length)]},reset(){this.state.hasSeenOpening=!1,localStorage.removeItem("rituals_lastSeen")},hasOverlay(t){return!!document.getElementById(`${t}Overlay`)}};window.Rituals=St;const H=()=>window.CommunityDB,It={state:{currentView:"public",isInitialized:!1},config:{MAX_INSPIRATION_LENGTH:200,PULSE_ANIMATION_DURATION:600,LEVEL_TITLES:{1:"Seeker",2:"Practitioner",3:"Adept",4:"Healer",5:"Master",6:"Sage",7:"Enlightened",8:"Buddha",9:"Light",10:"Emptiness"},RARITY_COLORS:{common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"},RARITY_LABELS:{common:"Common",uncommon:"Uncommon",rare:"Rare",epic:"Epic",legendary:"Legendary"},STATUS_RING:{online:{color:"var(--ring-available, #6b9b37)",label:"Available"},available:{color:"var(--ring-available, #6b9b37)",label:"Available"},away:{color:"var(--ring-guiding,   #e53e3e)",label:"Away"},guiding:{color:"var(--ring-guiding,   #e53e3e)",label:"Away"},silent:{color:"var(--ring-silent,    #7c3aed)",label:"In Silence"},deep:{color:"var(--ring-deep,      #1e40af)",label:"Deep Practice"},offline:{color:"var(--ring-offline,   #9ca3af)",label:"Offline"}},STATUS_ACTIVITIES:{online:"✨ Available",away:"🌿 Away",silent:"🤫 In Silence",deep:"🧘 Deep Practice",offline:"💤 Offline"},COUNTRY_CODES:{israel:"IL","united states":"US",usa:"US",us:"US","united kingdom":"GB",uk:"GB",canada:"CA",australia:"AU",germany:"DE",france:"FR",spain:"ES",italy:"IT",netherlands:"NL",belgium:"BE",switzerland:"CH",sweden:"SE",norway:"NO",denmark:"DK",finland:"FI",poland:"PL",portugal:"PT",austria:"AT",india:"IN",china:"CN",japan:"JP","south korea":"KR",brazil:"BR",mexico:"MX",argentina:"AR","south africa":"ZA",russia:"RU",ukraine:"UA",greece:"GR",turkey:"TR",egypt:"EG","new zealand":"NZ",ireland:"IE",singapore:"SG",thailand:"TH",indonesia:"ID",malaysia:"MY",philippines:"PH"}},_user(){var t,e;return((e=(t=window.Core)==null?void 0:t.state)==null?void 0:e.currentUser)??null},_esc(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML},_formatEntryDate(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric",year:"numeric"})}catch{return String(t)}},_countryFlag(t){const e=this.config.COUNTRY_CODES[t.toLowerCase().trim()];return e?[...e].map(i=>String.fromCodePoint(127462+i.charCodeAt(0)-65)).join(""):"🌍"},formatMinutes(t,e){const i=typeof t=="number"&&t>=0?t:0,o=Math.floor(i/60),n=i%60,r=o===0?`${n} minutes`:n===0?`${o} ${o===1?"hour":"hours"}`:`${o}h ${n}m`;return e&&(e.textContent=r),r},init(){if(this.state.isInitialized){console.warn("ProfileModule already initialized");return}try{this.renderHTML(),this.populateData(),this.setupCharCounter(),this.state.isInitialized=!0,window.addEventListener("statusChanged",t=>{const{status:e}=t.detail||{};if(!e)return;const i=this._user();i&&(i.status=e,i.community_status=e),this.updateStatusRing(e);const o=document.getElementById("statusPickerDot"),n=document.getElementById("statusPickerLabel"),r=this.config.STATUS_RING[e]||this.config.STATUS_RING.offline;o&&(o.style.background=r.color),n&&(n.textContent=r.label)})}catch(t){console.error("ProfileModule initialization failed:",t)}},getHTML(){const t=[{status:"online",label:"Available",color:"var(--ring-available,#6b9b37)",icon:"🟢"},{status:"away",label:"Away",color:"var(--ring-guiding,#e53e3e)",icon:"🔴"},{status:"silent",label:"In Silence",color:"var(--ring-silent,#7c3aed)",icon:"🟣"},{status:"deep",label:"Deep Practice",color:"var(--ring-deep,#1e40af)",icon:"🔵"},{status:"offline",label:"Offline",color:"var(--ring-offline,#9ca3af)",icon:"⚫"}],e=[{type:"journal",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',label:"Journal",count:"entries"},{type:"gratitude",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3-2 2-1-1"/></svg>',label:"Gratitude",count:"entries"},{type:"energy",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',label:"Energy",count:"check-ins"},{type:"flip",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',label:"Flip the Script",count:"entries"},{type:"tarot",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="5" width="11" height="14" rx="2"/><path d="M15.5 5.5 18 3l4 4-5.5 5.5"/><path d="m13 13 4.5 4.5"/><path d="m17.5 17.5 1 1"/></svg>',label:"Tarot Spreads",count:"readings"},{type:"meditation",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',label:"Meditations",count:"sessions"}],i=`background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
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
                                ${t.map(o=>`
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
                                ${e.map(o=>`
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
        </header>`},_getGamificationHTML(){var a,s,l,d,c,p;const t=(a=window.app)==null?void 0:a.gamification,e=((s=t==null?void 0:t.getStatusSummary)==null?void 0:s.call(t))??{xp:0,karma:0,badges:[]},i=((l=t==null?void 0:t.calculateLevel)==null?void 0:l.call(t))??{level:1,title:"Seeker",progress:0,pointsToNext:100};(p=(c=(d=window.app)==null?void 0:d.state)==null?void 0:c.getStats)==null||p.call(c);const o=i.title.match(/^[aeiou]/i)?"an":"a",n=Math.min(100,Math.max(0,i.progress??0)),r=[{value:e.karma,label:"Karma",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>',id:"statKarma"},{value:"…",label:"Blessings",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',id:"statBlessings"},{value:"-",label:"Fav Room",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',id:"statFavRoom"},{value:(e.badges||[]).length,label:"Badges",emoji:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',id:"statBadges"}];return`
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
                    <span style="font-weight:800;font-size:1rem;color:var(--neuro-accent);" id="profileGamificationXP">${e.xp}</span> XP
                    <span style="margin:0 4px;opacity:0.4;">·</span>
                    <span id="profileGamificationXPNext">${i.pointsToNext}</span> to next level
                </div>
            </div>

            <!-- 8-stat grid -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                ${r.map(h=>`
                <div style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;
                            padding:10px 6px;text-align:center;
                            box-shadow:3px 3px 8px rgba(0,0,0,0.09),-2px -2px 6px rgba(255,255,255,0.7);
                            transition:transform 0.15s;"
                     onmouseover="this.style.transform='translateY(-2px)'"
                     onmouseout="this.style.transform=''">
                    <div style="font-size:1.3rem;line-height:1;margin-bottom:4px;">${h.emoji}</div>
                    <div ${h.id?`id="${h.id}"`:""} style="font-size:1.15rem;font-weight:800;
                                color:var(--neuro-accent);line-height:1;">${h.value}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);
                                font-weight:600;text-transform:uppercase;
                                letter-spacing:0.03em;margin-top:3px;">${h.label}</div>
                </div>`).join("")}
            </div>
        </div>

        <style>
            @keyframes profile-xp-shimmer {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
        </style>`},animateGamificationBar(){requestAnimationFrame(()=>{const t=document.getElementById("profileGamificationXpBar");t&&(t.style.width=(t.dataset.width||0)+"%")})},refreshGamification(){const t=document.querySelector(".profile-gamification-section");if(!t)return;const e=document.createElement("div");e.innerHTML=this._getGamificationHTML(),t.replaceWith(e.firstElementChild),this.animateGamificationBar()},renderHTML(){const t=document.getElementById("profileHeroContainer");if(!t){console.warn("profileHeroContainer not found - skipping profile render");return}t.innerHTML=this.getHTML()},populateData(){const t=this._user();if(!t){console.warn("window.Core.state.currentUser not available");return}try{this.updateAvatar(t),this.updateName(t),this.updateKarma(t),this.updateBio(t),this.updateStatusRing(t.status),this.updateRole(t),this.updateBadges(),this.updateBirthday(t),this.updateCountry(t),this.updateProfileLocationRow(t),this.animateGamificationBar(),this.loadActivityData().catch(()=>{}),this.loadCommunityStats().catch(()=>{})}catch(e){console.error("Profile data population error:",e)}},updateAvatar(t){var r;const e=document.getElementById("profileAvatar"),i=document.getElementById("profileAvatarImg"),o=document.getElementById("profileAvatarFallback");if(!e)return;const n=t.avatar_url||t.avatarUrl;if(n&&i){i.src=n,i.style.display="block",o&&(o.style.display="none"),e.style.background="transparent";return}o&&(o.textContent=t.emoji||t.avatar||"?",o.style.display="block",i&&(i.style.display="none")),(r=window.Core)!=null&&r.getAvatarGradient&&(e.style.background=window.Core.getAvatarGradient(t.id||t.name||"default"))},updateName(t){const e=document.getElementById("profileName");e&&(e.textContent=t.name||t.displayName||"Member")},updateKarma(t){var d,c;const e=(c=(d=H())==null?void 0:d.getOwnGamificationState)==null?void 0:c.call(d),i=(e==null?void 0:e.karma)??t.karma??0,o=(e==null?void 0:e.xp)??t.xp??0,n=(e==null?void 0:e.level)??t.level??1,r=document.getElementById("profileGamificationXP"),a=document.getElementById("profileGamificationXPNext"),s=document.getElementById("profileGamificationXpBar");if(r&&(r.textContent=o.toLocaleString()),s){const p=[0,800,2e3,4200,7e3,12e3,3e4,6e4,18e4,45e4],h=p[n-1]||0,m=p[n]||p[p.length-1],g=m>h?Math.min(100,Math.round((o-h)/(m-h)*100)):100;s.dataset.width=g,s.style.width=g+"%",a&&(a.textContent=Math.max(0,m-o).toLocaleString())}const l=document.getElementById("statKarma");l&&(l.textContent=i.toLocaleString())},async loadCommunityStats(){var e,i,o,n;if(!((e=H())!=null&&e.ready))return;const t=(i=this._user())==null?void 0:i.id;if(t)try{const[{data:r,error:a},{data:s,error:l}]=await Promise.all([(o=H())==null?void 0:o._sb.from("profiles").select("gifts_given").eq("id",t).single(),(n=H())==null?void 0:n._sb.from("room_entries").select("room_id").eq("user_id",t)]),d=document.getElementById("statBlessings");if(d){const p=!a&&(r==null?void 0:r.gifts_given)!=null?r.gifts_given:0;d.textContent=p.toLocaleString()}const c=document.getElementById("statFavRoom");if(c)if(!l&&(s==null?void 0:s.length)>0){const p={};s.forEach(m=>{p[m.room_id]=(p[m.room_id]||0)+1});const h=Object.entries(p).sort((m,g)=>g[1]-m[1])[0][0];c.textContent=h.replace(/-/g," ").replace(/\b\w/g,m=>m.toUpperCase())}else c.textContent="-"}catch(r){console.warn("[ProfileModule] loadCommunityStats error:",r)}},updateBio(t){const e=document.getElementById("profileInspiration"),i=t.bio||t.inspiration;e&&i&&(e.textContent=`"${i}"`)},updateRole(t){const e=t.community_role||t.role||"Member",i=t.status||"available",o=document.getElementById("profileRoleBadge");o&&(o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${e}`);const n=document.getElementById("privateRole");n&&(n.textContent=e);const r=document.getElementById("privateStatus");r&&(r.textContent=i.charAt(0).toUpperCase()+i.slice(1))},updateBirthday(t){const e=document.getElementById("privateBirthday");if(e)if(t.birthday)try{e.textContent=new Date(t.birthday+"T00:00:00").toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"})}catch{e.textContent=t.birthday}else e.textContent="-"},updateCountry(t){const e=document.getElementById("privateCountry");e&&(e.textContent=t.country||"-")},async updateProfileLocationRow(t){var s,l;let{birthday:e,country:i}=t;if(!e&&!i&&((s=H())!=null&&s.ready))try{const d=await((l=H())==null?void 0:l.getMyProfile());if(d){e=d.birthday,i=d.country;const c=this._user();c&&(c.birthday=e,c.country=i)}}catch{}const o=document.getElementById("profileBirthdayDisplay");if(o)if(e)try{const d=new Date(e+"T00:00:00").toLocaleDateString(void 0,{month:"long",day:"numeric"});o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${d}`}catch{o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${e}`}else o.textContent="";const n=document.getElementById("profileCountryDisplay");n&&(n.textContent=i?`${this._countryFlag(i)} ${i}`:"");const r=document.getElementById("profileCountrySep");r&&(r.style.display=i?"":"none");const a=document.querySelector("#profileMetaRow .profile-meta-sep");a&&(a.style.display=e||i?"":"none")},async loadActivityData(){var n,r,a,s,l,d,c,p,h,m,g,f,b,M,C,_,k,A,j,T,P,U,B,W,O,V,$,S,F,G,Z,Q,ee;const t=(n=window.app)==null?void 0:n.gamification,e=((r=t==null?void 0:t.getStatusSummary)==null?void 0:r.call(t))??null,i=((l=(s=(a=window.app)==null?void 0:a.state)==null?void 0:s.getStats)==null?void 0:l.call(s))??null;if(e&&i){this._setActivityCount("journal",e.totalJournalEntries??0,"entries"),this._setActivityCount("gratitude",i.totalGratitudes??0,"entries"),this._setActivityCount("energy",i.totalEnergyEntries??((h=(p=(c=(d=window.app)==null?void 0:d.state)==null?void 0:c.data)==null?void 0:p.energyEntries)==null?void 0:h.length)??0,"check-ins"),this._setActivityCount("flip",i.totalFlipEntries??((b=(f=(g=(m=window.app)==null?void 0:m.state)==null?void 0:g.data)==null?void 0:f.flipEntries)==null?void 0:b.length)??0,"entries"),this._setActivityCount("tarot",e.totalTarotSpreads??0,"readings"),this._setActivityCount("meditation",e.totalMeditations??i.weeklyMeditations??((k=(_=(C=(M=window.app)==null?void 0:M.state)==null?void 0:C.data)==null?void 0:_.meditationEntries)==null?void 0:k.length)??0,"sessions"),this._activityData={_fromGamification:!0};return}if((j=(A=window.app)==null?void 0:A.state)!=null&&j.ready)try{await window.app.state.ready}catch{}const o=(P=(T=window.app)==null?void 0:T.state)==null?void 0:P.data;if(o){const y=(o.gratitudeEntries||[]).reduce((v,x)=>{var E;return v+(((E=x.entries)==null?void 0:E.length)||0)},0);this._setActivityCount("journal",((U=o.journalEntries)==null?void 0:U.length)??0,"entries"),this._setActivityCount("gratitude",y,"entries"),this._setActivityCount("energy",((B=o.energyEntries)==null?void 0:B.length)??0,"check-ins"),this._setActivityCount("flip",((W=o.flipEntries)==null?void 0:W.length)??0,"entries"),this._setActivityCount("tarot",((O=o.tarotReadings)==null?void 0:O.length)??0,"readings"),this._setActivityCount("meditation",((V=o.meditationEntries)==null?void 0:V.length)??0,"sessions"),this._activityData=o;return}try{if(($=H())!=null&&$.ready){const y=await((S=H())==null?void 0:S.getOwnFullProgress());if(y){const v=(y.gratitudeEntries||[]).reduce((x,E)=>{var I;return x+(((I=E.entries)==null?void 0:I.length)||0)},0);this._setActivityCount("journal",((F=y.journalEntries)==null?void 0:F.length)??0,"entries"),this._setActivityCount("gratitude",v,"entries"),this._setActivityCount("energy",((G=y.energyEntries)==null?void 0:G.length)??0,"check-ins"),this._setActivityCount("flip",((Z=y.flipEntries)==null?void 0:Z.length)??0,"entries"),this._setActivityCount("tarot",((Q=y.tarotReadings)==null?void 0:Q.length)??0,"readings"),this._setActivityCount("meditation",((ee=y.meditationEntries)==null?void 0:ee.length)??0,"sessions"),this._activityData=y}}}catch(y){console.warn("[ProfileModule] loadActivityData fallback failed:",y)}},_setActivityCount(t,e,i){const o=document.getElementById(`activityCount_${t}`);o&&(o.textContent=e>0?`${e} ${i}`:`No ${i} yet`)},async openActivityModal(t){var l;this._activityData||await this.loadActivityData();const i={journal:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Journal Entries'},gratitude:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3-2 2-1-1"/></svg> Gratitude Entries'},energy:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Energy Check-ins'},flip:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Flip the Script'},tarot:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="5" width="11" height="14" rx="2"/><path d="M15.5 5.5 18 3l4 4-5.5 5.5"/><path d="m13 13 4.5 4.5"/><path d="m17.5 17.5 1 1"/></svg> Tarot Spreads'},meditation:{title:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg> Meditation Sessions'}}[t],o=((l=this._activityData)==null?void 0:l[`${t}Entries`])||[],n=document.getElementById("activityModalTitle"),r=document.getElementById("activityModalBody");n&&(n.innerHTML=i.title),r&&(r.innerHTML=o.length?o.map(d=>this._renderActivityEntry(t,d)).join(""):'<div style="text-align:center;color:var(--text-muted);padding:2rem;">No entries yet</div>');const a=document.getElementById("activityModal"),s=document.getElementById("activityModalInner");a&&(a.style.display="flex",requestAnimationFrame(()=>{a.style.opacity="1",s.style.transform="translateY(0)"}),a.onclick=d=>{d.target===a&&this.closeActivityModal()},this._activityEscHandler=d=>{d.key==="Escape"&&this.closeActivityModal()},document.addEventListener("keydown",this._activityEscHandler))},closeActivityModal(){const t=document.getElementById("activityModal"),e=document.getElementById("activityModalInner");t&&(t.style.opacity="0",e.style.transform="translateY(16px)",setTimeout(()=>{t.style.display="none"},250),this._activityEscHandler&&(document.removeEventListener("keydown",this._activityEscHandler),this._activityEscHandler=null))},_renderActivityEntry(t,e){var n;const i=this._formatEntryDate(e.timestamp||e.date),o=`border-radius:12px;padding:12px 14px;margin-bottom:10px;
                      background:var(--surface,rgba(0,0,0,0.03));
                      border-left:3px solid var(--neuro-accent);
                      font-size:0.86rem;line-height:1.6;`;switch(t){case"journal":{const r=e.situation||e.feelings||"",a=e.mood?`<span style="margin-left:6px;opacity:0.7;">${e.mood}</span>`:"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}${a}</div>
                    <div style="color:var(--neuro-text);">${this._esc(r)}</div>
                </div>`}case"gratitude":{const r=e.entries||[];return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${i}</div>
                    ${r.map(a=>`<div style="margin-bottom:3px;display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3-2 2-1-1"/></svg> ${this._esc(a)}</div>`).join("")}
                </div>`}case"energy":{const r=e.energy??"-",a=e.notes?`<div style="margin-top:4px;opacity:0.8;">${this._esc(e.notes)}</div>`:"",s=(e.moodTags||[]).length?`<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;">
                        ${e.moodTags.map(l=>`<span style="background:var(--neuro-accent-a10);color:var(--neuro-accent);border-radius:99px;padding:2px 8px;font-size:0.72rem;">${this._esc(l)}</span>`).join("")}
                       </div>`:"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    <div style="font-size:1rem;font-weight:700;color:var(--neuro-accent);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Energy: ${r}/10</div>
                    ${s}${a}
                </div>`}case"flip":{const r=e.original||e.flipped_from||e.situation||e.text||e.content||"",a=e.flipped||e.reframe||"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    ${r?`<div style="color:var(--neuro-text);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> ${this._esc(r)}</div>`:""}
                    ${a?`<div style="margin-top:6px;color:var(--neuro-accent);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> ${this._esc(a)}</div>`:""}
                </div>`}case"tarot":{const r=e.spreadType||e.spreadKey||"Spread",a=(e.cards||[]).slice(0,3);return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    <div style="font-weight:700;color:var(--neuro-accent);margin-bottom:4px;">🃏 ${this._esc(r)}</div>
                    ${a.length?`<div style="font-size:0.8rem;color:var(--neuro-text);opacity:0.8;">
                        ${a.map(s=>`<div style="margin-bottom:2px;">• ${this._esc(s.name||"")}</div>`).join("")}
                        ${((n=e.cards)==null?void 0:n.length)>3?`<div style="opacity:0.6;">+${e.cards.length-3} more cards</div>`:""}
                    </div>`:""}
                </div>`}case"meditation":{const r=e.title||e.category||"Session",a=e.duration?`${e.duration} min`:"",s=e.chakra?`· ${e.chakra} chakra`:"";return`<div style="${o}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${i}</div>
                    <div style="font-weight:700;color:var(--neuro-accent);display:flex;align-items:center;gap:0.4rem;">
                        🧘 ${this._esc(r)}
                    </div>
                    ${a||s?`<div style="font-size:0.8rem;margin-top:3px;opacity:0.75;">${a}${s}</div>`:""}
                </div>`}default:return""}},updateBadges(){var i,o,n;const t=((n=(o=(i=window.app)==null?void 0:i.gamification)==null?void 0:o.state)==null?void 0:n.badges)??[],e=document.getElementById("statBadges");e&&(e.textContent=t.length)},updateStatusRing(t){const e=this.config.STATUS_RING[t]||this.config.STATUS_RING.offline,i=document.getElementById("statusRing");i&&(i.style.borderColor=e.color,i.style.boxShadow=`0 0 0 4px ${e.color}33`);const o=document.getElementById("statusPickerDot"),n=document.getElementById("statusPickerLabel");o&&(o.style.background=e.color),n&&(n.textContent=e.label)},toggleStatusPicker(){const t=document.getElementById("statusPickerDropdown");if(!t)return;const e=t.style.display!=="none";if(t.style.display=e?"none":"block",!e){const i=o=>{var n;!((n=document.getElementById("statusPickerBtn"))!=null&&n.contains(o.target))&&!t.contains(o.target)&&(t.style.display="none",document.removeEventListener("click",i))};setTimeout(()=>document.addEventListener("click",i),0)}},async setStatus(t,e,i){var d,c,p,h,m;const o=document.getElementById("statusPickerDropdown");o&&(o.style.display="none");const n=(d=this._user())==null?void 0:d.id;n&&window.ActiveMembers&&window.ActiveMembers.updateMemberStatus(n,t);const r=this.config.STATUS_ACTIVITIES[t]||"✨ Available";this.updateStatusRing(t);const a=document.getElementById("statusPickerDot"),s=document.getElementById("statusPickerLabel");a&&(a.style.background=i),s&&(s.textContent=e);const l=this._user();l&&(l.status=t,l.community_status=t);try{const g=((p=(c=window.Core)==null?void 0:c.state)==null?void 0:p.currentRoom)||null;await Promise.all([(h=H())==null?void 0:h.setPresence(t,r,g),(m=H())==null?void 0:m.updateProfile({community_status:t})]),window.Core.showToast(`Status set to ${e}`)}catch(g){console.error("[ProfileModule] setStatus error:",g),window.Core.showToast("Could not update status - please try again")}window.dispatchEvent(new CustomEvent("statusChanged",{detail:{status:t}}))},updatePresenceCount(){var t,e;(e=(t=window.Core)==null?void 0:t.updatePresenceCount)==null||e.call(t)},toggleProfileView(t){var e;t!=="public"&&t!=="private"||(document.querySelectorAll(".v-btn").forEach(i=>{const o=i.textContent.trim()==="Public View",n=t==="public"&&o||t==="private"&&!o;i.classList.toggle("active",n),i.setAttribute("aria-pressed",String(n))}),(e=document.getElementById("privateDetails"))==null||e.classList.toggle("visible",t==="private"),this.state.currentView=t)},async sendPulse(){var i;const t=(i=window.Core)==null?void 0:i.state;if(!t){console.error("Core not available");return}if(t.pulseSent){window.Core.showToast("Already offered");return}const e=document.getElementById("pulseBtn");if(e)try{e.classList.add("sending"),setTimeout(async()=>{var r;e.classList.remove("sending"),e.classList.add("sent"),e.innerHTML='✓<span class="pulse-ripple"></span>',t.pulseSent=!0;const o=document.getElementById("pulseFill");o&&(o.style.width="50%"),window.Core.showToast("Calm offered to the community"),await((r=H())==null?void 0:r.setPresence("online","💗 Offering calm",t.currentRoom||null));const n=this._user();n&&(n.activity="💗 Offering calm")},this.config.PULSE_ANIMATION_DURATION)}catch(o){console.error("Error sending pulse:",o)}},editProfile(){let t=document.getElementById("_avatarFileInput");t||(t=document.createElement("input"),t.id="_avatarFileInput",t.type="file",t.accept="image/jpeg,image/png,image/webp,image/gif",t.style.display="none",document.body.appendChild(t),t.addEventListener("change",()=>{var i;const e=(i=t.files)==null?void 0:i[0];e&&this._uploadAvatar(e),t.value=""})),t.click()},async _uploadAvatar(t){var o;if(t.size>5*1024*1024){window.Core.showToast("Image too large - max 5MB");return}const e=new FileReader;e.onload=n=>{const r=document.getElementById("profileAvatarImg"),a=document.getElementById("profileAvatarFallback"),s=document.getElementById("profileAvatar");r&&(r.src=n.target.result,r.style.display="block"),a&&(a.style.display="none"),s&&(s.style.background="transparent")},e.readAsDataURL(t),window.Core.showToast("Uploading photo...");const i=await((o=H())==null?void 0:o.uploadAvatar(t));if(i){const n=this._user();n&&(n.avatar_url=i),window.Core.showToast("Profile photo updated")}else window.Core.showToast("Upload failed - please try again"),this.updateAvatar(this._user())},async editRole(){var r,a;const t=((r=this._user())==null?void 0:r.role)||"",e=prompt("Enter your community role (e.g. Meditator, Healer, Teacher):",t);if(e===null)return;const i=e.trim().substring(0,60);if(!await((a=H())==null?void 0:a.updateProfile({community_role:i||null}))){window.Core.showToast("Could not save - please try again");return}const n=this._user();n&&(n.community_role=i||"Member",n.role=i||"Member"),this.updateRole(this._user()),window.Core.showToast("Role updated")},async editInspiration(){var a;const t=document.getElementById("profileInspiration");if(!t)return;const e=t.textContent.replace(/"/g,"").trim(),i=prompt("Edit your inspiration message:",e);if(!(i!=null&&i.trim()))return;const o=i.trim().substring(0,this.config.MAX_INSPIRATION_LENGTH).replace(/<[^>]*>/g,"");if(!o)return;if(!await((a=H())==null?void 0:a.updateProfile({inspiration:o}))){window.Core.showToast("Could not save - please try again");return}t.textContent=`"${o}"`;const r=this._user();r&&(r.inspiration=o),window.Core.showToast("Inspiration updated")},async _createInlineEditor({fieldId:t,dbKey:e,currentValue:i,inputType:o,placeholder:n,maxLength:r,successToast:a,validate:s,onSave:l}){const d=document.getElementById(t),c=d==null?void 0:d.closest(".detail-row");if(!c||c.querySelector("input"))return;const p=c.querySelector(".edit-inline-btn");d&&(d.style.display="none"),p&&(p.style.display="none");const h=`flex:1;padding:4px 8px;border-radius:8px;
            border:1px solid rgba(0,0,0,0.15);font-size:0.85rem;
            background:var(--neuro-bg);color:var(--neuro-text);`,m=`margin-left:6px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;font-weight:700;
            background:var(--neuro-accent);color:#fff;`,g=`margin-left:4px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;opacity:0.6;
            background:rgba(0,0,0,0.06);color:var(--neuro-text);`,f=document.createElement("input");f.type=o,f.value=i,f.maxLength=r,f.placeholder=n,f.style.cssText=h;const b=document.createElement("button");b.textContent="✓",b.style.cssText=m;const M=document.createElement("button");M.textContent="✕",M.style.cssText=g;const C=()=>{f.remove(),b.remove(),M.remove(),d&&(d.style.display=""),p&&(p.style.display="")},_=async()=>{var j;const k=f.value.trim().substring(0,r);if(s){const T=s(k);if(T){window.Core.showToast(T);return}}if(b.disabled=!0,b.textContent="...",!await((j=H())==null?void 0:j.updateProfile({[e]:k||null}))){window.Core.showToast("Could not save - please try again"),b.disabled=!1,b.textContent="✓";return}C(),l(k||null),window.Core.showToast(a)};b.onclick=_,M.onclick=C,f.addEventListener("keydown",k=>{k.key==="Enter"&&_(),k.key==="Escape"&&C()}),c.appendChild(f),c.appendChild(b),c.appendChild(M),f.focus()},editBirthday(){var n;const t=document.getElementById("profileBirthdayDisplay");if(!t)return;const e=((n=this._user())==null?void 0:n.birthday)||"",i=document.createElement("input");i.type="date",i.value=e,i.style.cssText=`padding:3px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.15);
            font-size:0.8rem;background:var(--neuro-bg);color:var(--neuro-text);`;const o=async()=>{var l;const r=i.value.trim();if(r&&!/^\d{4}-\d{2}-\d{2}$/.test(r)){window.Core.showToast("Invalid date");return}if(!await((l=H())==null?void 0:l.updateProfile({birthday:r||null}))){window.Core.showToast("Could not save - please try again");return}const s=this._user();s&&(s.birthday=r),i.replaceWith(t),t.style.display="",this.updateBirthday(this._user()),this.updateProfileLocationRow(this._user()),window.Core.showToast("Birthday updated")};i.addEventListener("keydown",r=>{r.key==="Enter"&&o(),r.key==="Escape"&&(i.replaceWith(t),t.style.display="")}),i.addEventListener("blur",o),t.style.display="none",t.parentNode.insertBefore(i,t.nextSibling),i.focus()},editCountry(){var n;const t=document.getElementById("profileCountryDisplay");if(!t)return;const e=((n=this._user())==null?void 0:n.country)||"",i=document.createElement("input");i.type="text",i.value=e,i.placeholder="Your country",i.maxLength=60,i.style.cssText=`padding:3px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.15);
            font-size:0.8rem;background:var(--neuro-bg);color:var(--neuro-text);width:90px;`;const o=async()=>{var l;const r=i.value.trim();if(!await((l=H())==null?void 0:l.updateProfile({country:r||null}))){window.Core.showToast("Could not save - please try again");return}const s=this._user();s&&(s.country=r),i.replaceWith(t),t.style.display="",this.updateCountry(this._user()),this.updateProfileLocationRow(this._user()),window.Core.showToast("Country updated")};i.addEventListener("keydown",r=>{r.key==="Enter"&&o(),r.key==="Escape"&&(i.replaceWith(t),t.style.display="")}),i.addEventListener("blur",o),t.style.display="none",t.parentNode.insertBefore(i,t.nextSibling),i.focus()},setupCharCounter(){const t=document.getElementById("reflectionInput"),e=document.getElementById("charCount");t&&e&&t.addEventListener("input",()=>{e.textContent=t.value.length})},refresh(){this.populateData()}};window.ProfileModule=It;const Tt={state:{isInitialized:!1,appreciatedReflections:new Set,reportingUserId:null},config:{MIN_REFLECTION_LENGTH:1,MAX_REFLECTION_LENGTH:500,MIN_REPORT_LENGTH:10,MIN_MODERATOR_MESSAGE_LENGTH:10,MIN_TECHNICAL_DESCRIPTION_LENGTH:10},async init(){if(!this.state.isInitialized)try{this.state.appreciatedReflections=await u.getMyAppreciations(),this.renderReflectionsHTML(),await this.renderReflections(),this.subscribeToNewReflections(),this._initWhisperBadge(),this.state.isInitialized=!0}catch(t){console.error("[CommunityModule] init failed:",t)}},_initWhisperBadge(){const t=()=>{var e;return(e=window.WhisperModal)==null?void 0:e.refreshUnreadBadge()};if(u!=null&&u.ready)t();else{const e=setInterval(()=>{u!=null&&u.ready&&(clearInterval(e),t())},300)}},renderReflectionsHTML(){const t=document.getElementById("communityReflectionsContainer");if(!t){console.warn("[CommunityModule] #communityReflectionsContainer not found");return}t.innerHTML=this._buildReflectionsShell(),this._setupCharCounter("reflectionInput","charCount")},_buildReflectionsShell(){var a,s;const t=((s=(a=window.Core)==null?void 0:a.state)==null?void 0:s.currentUser)||{},e=t.name||"You",i=t.avatar_url||"",o=window.Core.getAvatarGradient(t.id||"me"),n=i?`<img src="${i}" alt="${e}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" loading="lazy" decoding="async">`:t.emoji||e.charAt(0).toUpperCase();return`
        <section class="section">
            <div class="section-header">
                <div class="section-title">Community Reflections</div>
            </div>

            <div class="reflection" style="margin-bottom:16px;">
                <div class="ref-header">
                    <div class="ref-avatar" style="${i?"background:transparent;":`background:${o};`}cursor:pointer;"
                         role="button" tabindex="0"
                         aria-label="View profile"
                         onclick="CommunityModule.viewMember('${t.id}')"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();CommunityModule.viewMember('${t.id}');}">
                        ${n}
                    </div>
                    <div class="ref-meta" style="flex:1;">
                        <div class="ref-author">${this._esc(e)}</div>
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
        </section>`},async renderReflections(){const t=document.getElementById("reflectionsContainer");if(t){t.innerHTML='<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Loading reflections...</div>';try{const[e,i]=await Promise.all([u.getReflections(20),u.getBlockedUsers()]),o=e.filter(n=>{var r;return!i.has((r=n.profiles)==null?void 0:r.id)});t.innerHTML=o.length?o.map(n=>this._buildReflectionHTML(n)).join(""):'<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Be the first to share a reflection ✨</div>'}catch(e){console.error("[CommunityModule] renderReflections error:",e)}}},_buildReflectionHTML(t){var h,m,g,f,b,M;const e=t.profiles||{},i=e.name||"Community Member",o=e.avatar_url||"",n=window.Core.getAvatarGradient(e.id||t.id),r=this._timeAgo(t.created_at),a=e.id===((g=(m=(h=window.Core)==null?void 0:h.state)==null?void 0:m.currentUser)==null?void 0:g.id),s=(M=(b=(f=window.Core)==null?void 0:f.state)==null?void 0:b.currentUser)==null?void 0:M.is_admin,l=this.state.appreciatedReflections.has(t.id),d=o?`<img src="${o}" alt="${this._esc(i)}" width="40" height="40" loading="lazy" decoding="async">`:this._esc(e.emoji||i.charAt(0).toUpperCase()),c=o?"background:transparent;":`background:${n};`,p=a?`
            <div style="margin-left:auto;display:flex;gap:4px;">
                <button type="button" onclick="CommunityModule.editReflection('${t.id}')"   class="ref-action" title="Edit"           style="font-size:14px;opacity:0.6;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button type="button" onclick="CommunityModule.deleteReflection('${t.id}')" class="ref-action" title="Delete"         style="font-size:14px;opacity:0.6;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>`:s?`
            <div style="margin-left:auto;display:flex;gap:4px;">
                <button type="button" onclick="CommunityModule.deleteReflection('${t.id}')" class="ref-action" title="Delete (Admin)" style="font-size:14px;opacity:0.6;color:var(--neuro-accent);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>`:"";return`
            <div class="reflection" data-reflection-id="${t.id}">
                <div class="ref-header">
                    <div class="ref-avatar" style="${c}cursor:pointer;"
                         onclick="CommunityModule.viewMember('${e.id}')">
                        ${d}
                    </div>
                    <div class="ref-meta">
                        <div class="ref-author" style="cursor:pointer;"
                             onclick="CommunityModule.viewMember('${e.id}')">
                            ${this._esc(i)}
                        </div>
                        <div class="ref-time">${r}</div>
                    </div>
                </div>
                <div class="ref-content">${this._esc(t.content)}</div>
                <div class="ref-actions">
                    <button type="button" class="ref-action ${l?"appreciated":""}"
                            onclick="CommunityModule.appreciate(this, '${t.id}')">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg></span>
                        <span class="appreciation-count">Appreciate (${t.appreciation_count||0})</span>
                    </button>
                    <button type="button" class="ref-action" onclick="CommunityModule.whisper('${e.id}')">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span>Whisper</span>
                    </button>
                    ${p}
                </div>
            </div>`},subscribeToNewReflections(){if(!(u!=null&&u.ready)){const e=setInterval(()=>{u!=null&&u.ready&&(clearInterval(e),this.subscribeToNewReflections())},300);return}if(!u.subscribeToReflections(async e=>{var o,n,r,a,s;((o=e.profiles)==null?void 0:o.id)===((a=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)==null?void 0:a.id)||(await u.getBlockedUsers()).has((s=e.profiles)==null?void 0:s.id)||this._prependReflection(e)})){const e=setInterval(()=>{u!=null&&u.ready&&(clearInterval(e),this.subscribeToNewReflections())},300)}},_prependReflection(t){const e=document.getElementById("reflectionsContainer");if(!e)return;const i=document.createElement("div");i.innerHTML=this._buildReflectionHTML(t);const o=i.firstElementChild;o&&e.insertBefore(o,e.firstChild)},async shareReflection(){const t=document.getElementById("reflectionInput");if(!t)return;const e=t.value.trim();if(e.length<this.config.MIN_REFLECTION_LENGTH){window.Core.showToast("Please write something first");return}if(e.length>this.config.MAX_REFLECTION_LENGTH){window.Core.showToast(`Reflection too long (max ${this.config.MAX_REFLECTION_LENGTH} characters)`);return}try{const i=await u.postReflection(e);if(!i){window.Core.showToast("Could not share reflection - please try again");return}t.value="";const o=document.getElementById("charCount");o&&(o.textContent="0"),this._prependReflection(i),window.Core.showToast("Reflection shared with the community")}catch(i){console.error("[CommunityModule] shareReflection error:",i)}},async deleteReflection(t){var i;if(!confirm("Remove this reflection?"))return;await u.deleteReflection(t)?((i=document.querySelector(`[data-reflection-id="${t}"]`))==null||i.remove(),window.Core.showToast("Reflection removed")):window.Core.showToast("Could not remove reflection")},editReflection(t){const e=document.querySelector(`[data-reflection-id="${t}"]`),i=e==null?void 0:e.querySelector(".ref-content");if(!i)return;const o=i.textContent.trim();i.innerHTML=`
            <textarea id="editReflectionInput_${t}" maxlength="500" rows="3"
                      style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);
                             background:var(--surface);color:var(--text);resize:vertical;
                             font-size:14px;line-height:1.6;box-sizing:border-box;"
            >${this._esc(o)}</textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                <span style="font-size:11px;color:var(--text-muted)">
                    <span id="editCharCount_${t}">${o.length}</span>/500
                </span>
                <div style="display:flex;gap:8px;">
                    <button type="button" onclick="CommunityModule.saveEditReflection('${t}')"
                            style="padding:5px 14px;background:var(--accent);color:#fff;border:none;
                                   border-radius:var(--radius-md);cursor:pointer;font-size:13px;font-weight:600;">Save</button>
                    <button type="button" onclick="CommunityModule.cancelEditReflection('${t}')"
                            style="padding:5px 12px;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                   color:var(--neuro-text);border:none;border-radius:var(--radius-md);cursor:pointer;font-size:13px;">Cancel</button>
                </div>
            </div>`;const n=document.getElementById(`editReflectionInput_${t}`);n&&(this._setupCharCounter(`editReflectionInput_${t}`,`editCharCount_${t}`),n.focus(),n.setSelectionRange(n.value.length,n.value.length))},cancelEditReflection(t){const e=document.querySelector(`[data-reflection-id="${t}"]`),i=e==null?void 0:e.querySelector(".ref-content");i&&u.getReflections(20).then(o=>{const n=o.find(r=>r.id===t);n&&(i.textContent=n.content)}).catch(()=>{})},async saveEditReflection(t){const e=document.getElementById(`editReflectionInput_${t}`);if(!e)return;const i=e.value.trim();if(!i){window.Core.showToast("Reflection cannot be empty");return}if(i.length>500){window.Core.showToast("Too long (max 500 characters)");return}if(e.disabled=!0,await u.updateReflection(t,i)){const n=document.querySelector(`[data-reflection-id="${t}"] .ref-content`);n&&(n.textContent=i),window.Core.showToast("Reflection updated")}else e.disabled=!1,window.Core.showToast("Could not update - please try again")},async appreciate(t,e){if(!(!t||!e))try{const i=this.state.appreciatedReflections.has(e),o=await u.toggleAppreciation(e,i);if(!o)return;this.state.appreciatedReflections[o.appreciated?"add":"delete"](e),t.classList.toggle("appreciated",o.appreciated);const n=await u.getReflectionCount(e),r=t.querySelector(".appreciation-count");r&&n!==null&&(r.textContent=`Appreciate (${n})`)}catch(i){console.error("[CommunityModule] appreciate error:",i)}},async whisper(t){if(t)try{const e=await u.getProfile(t);WhisperModal.openThread(t,(e==null?void 0:e.name)||"Member",(e==null?void 0:e.emoji)||"",(e==null?void 0:e.avatar_url)||"")}catch{WhisperModal.openThread(t,"Member","","")}},renderMembers(){},viewMember(t){t&&(window.MemberProfileModal?MemberProfileModal.open(t):window.Core.showToast("Member profiles loading..."))},renderWaves(){const t=document.getElementById("wavesContainer");if(!t)return;const e=[{id:1,title:"Evening Wind Down",time:"Tonight at 8:00 PM",participants:42,progress:67},{id:2,title:"Sunday Morning Stillness",time:"Tomorrow at 7:00 AM",participants:28,progress:45}];t.innerHTML=e.map(i=>`
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
            </div>`).join("")},contributeWave(){window.Core.showToast("Contribution recorded! Start your practice.")},showCrisisModal(){this.openModal("crisisModal")},closeCrisisModal(){this.closeModal("crisisModal")},showReportModal(t=null){this.state.reportingUserId=t,this.openModal("reportModal")},closeReportModal(){this.closeModal("reportModal"),this._clearFields(["reportReason","reportDetails"]),this.state.reportingUserId=null},async submitReport(){var o,n,r;const t=(o=document.getElementById("reportReason"))==null?void 0:o.value,e=((r=(n=document.getElementById("reportDetails"))==null?void 0:n.value)==null?void 0:r.trim())||"";if(!t){window.Core.showToast("Please select a reason");return}await u.submitReport(this.state.reportingUserId,t,e)?(window.Core.showToast("Report submitted. Thank you for keeping the space safe."),this.closeReportModal()):window.Core.showToast("Could not submit report - please try again")},showBlockModal(){this.openModal("blockModal")},closeBlockModal(){this.closeModal("blockModal"),this._clearFields(["blockUsername"])},async confirmBlock(){var o,n;const t=(n=(o=document.getElementById("blockUsername"))==null?void 0:o.value)==null?void 0:n.trim();if(!t){window.Core.showToast("Please enter a username");return}const e=await u.getUserByName(t);if(!e){window.Core.showToast("User not found");return}await u.blockUser(e.id)?(window.Core.showToast(`${e.name} has been blocked`),this.closeBlockModal(),await this.renderReflections()):window.Core.showToast("Could not block user - please try again")},hideMessagesFromUser(t){document.querySelectorAll(".chat-msg").forEach(e=>{var i;(i=e.querySelector("div"))!=null&&i.textContent.includes(t)&&(e.style.display="none")})},showHelpModal(){this.openModal("helpModal")},closeHelpModal(){this.closeModal("helpModal")},needHelp(){this.showHelpModal()},showModeratorModal(){this.closeHelpModal(),this.openModal("moderatorModal")},closeModeratorModal(){this.closeModal("moderatorModal"),this._clearFields(["moderatorMessage"]);const t=document.getElementById("moderatorUrgency");t&&(t.value="low")},contactModerator(){this.showModeratorModal()},submitModeratorRequest(){var e,i;const t=(i=(e=document.getElementById("moderatorMessage"))==null?void 0:e.value)==null?void 0:i.trim();if(!t||t.length<this.config.MIN_MODERATOR_MESSAGE_LENGTH){window.Core.showToast(`Please describe your situation (at least ${this.config.MIN_MODERATOR_MESSAGE_LENGTH} characters)`);return}window.Core.showToast("Request sent. A moderator will reach out shortly."),this.closeModeratorModal()},showTechnicalModal(){this.closeHelpModal(),this.openModal("technicalModal")},closeTechnicalModal(){this.closeModal("technicalModal"),this._clearFields(["technicalType","technicalDescription","technicalDevice"])},reportTechnicalIssue(){this.showTechnicalModal()},submitTechnicalIssue(){var i,o,n;const t=(i=document.getElementById("technicalType"))==null?void 0:i.value,e=(n=(o=document.getElementById("technicalDescription"))==null?void 0:o.value)==null?void 0:n.trim();if(!t){window.Core.showToast("Please select an issue type");return}if(!e||e.length<this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH){window.Core.showToast(`Please provide more details (at least ${this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH} characters)`);return}window.Core.showToast("Issue reported. Our tech team will investigate."),this.closeTechnicalModal()},showGuidelinesModal(){this.closeHelpModal(),this.openModal("guidelinesModal")},closeGuidelinesModal(){this.closeModal("guidelinesModal")},viewGuidelines(){this.showGuidelinesModal()},muteChat(){var i;const t=document.getElementById("psSidebar");if(!t)return;const e=t.classList.contains("muted");t.classList.toggle("muted"),window.Core.showToast(e?"Chat unmuted":"Chat muted"),!e&&t.classList.contains("open")&&(t.classList.remove("open"),(i=document.getElementById("fabChat"))==null||i.classList.remove("hidden"))},registerEvent(){window.Core.showToast("Registration confirmed! Check your email.")},openModal(t){const e=document.getElementById(t);e?e.classList.add("active"):console.warn(`[CommunityModule] Modal not found: ${t}`)},closeModal(t){var e;(e=document.getElementById(t))==null||e.classList.remove("active")},_setupCharCounter(t,e){const i=document.getElementById(t),o=document.getElementById(e);i&&o&&i.addEventListener("input",()=>{o.textContent=i.value.length})},_clearFields(t){t.forEach(e=>{const i=document.getElementById(e);i&&(i.value="")})},_timeAgo(t){if(!t)return"";const e=Date.now()-new Date(t).getTime(),i=Math.floor(e/6e4),o=Math.floor(e/36e5),n=Math.floor(e/864e5);return i<1?"Just now":i<60?`${i}m ago`:o<24?`${o}h ago`:`${n}d ago`},_esc(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}};window.CommunityModule=Tt;const N={state:{modalsInjected:!1},init(){},injectModals(){const t=!!document.getElementById("reportModal");if(this.state.modalsInjected&&!t&&(this.state.modalsInjected=!1),!(this.state.modalsInjected||t))try{document.body.insertAdjacentHTML("beforeend",this.getAllModalsHTML()),this.state.modalsInjected=!0}catch(e){console.error("Failed to inject SafetyBar modals:",e)}},getAllModalsHTML(){return`
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
    </div>`},handleOverlayClick(t,e){t.target===t.currentTarget&&this.closeModal(e)},openModal(t){this.injectModals();const e=document.getElementById(`${t}Modal`);e?e.classList.add("active"):console.warn(`[SafetyBar] openModal: #${t}Modal not found`)},closeModal(t){var e;(e=document.getElementById(`${t}Modal`))==null||e.classList.remove("active")},_switchModal(t,e){this.closeModal(t),this.openModal(e)},async submitReport(){var i,o,n,r,a;const t=(i=document.getElementById("reportReason"))==null?void 0:i.value,e=(n=(o=document.getElementById("reportDetails"))==null?void 0:o.value)==null?void 0:n.trim();if(!t){window.Core.showToast("Please select a reason");return}(a=(r=window.Community)==null?void 0:r.submitReport)==null||a.call(r);try{await this._writeAdminNotification("report",{reason:t,details:e,room:this._getCurrentRoom()}),await this._pushAdmins("⚠️ New Report",`${this._senderName()} reported: ${t}${e?" - "+e.substring(0,60):""}`)}catch(s){console.error("submitReport admin notify error:",s)}},confirmBlock(){var t;typeof((t=window.Community)==null?void 0:t.confirmBlock)=="function"?window.Community.confirmBlock():console.error("Community.confirmBlock not available")},toggleHelpMePanel(){const t=document.getElementById("helpMePanel");t&&(t.style.display=t.style.display==="none"?"block":"none")},async submitHelpMe(){var i,o;const t=(o=(i=document.getElementById("helpMeText"))==null?void 0:i.value)==null?void 0:o.trim();if(!t){window.Core.showToast("Please write a short message");return}const e=document.querySelector("#helpMePanel button");e&&(e.disabled=!0,e.textContent="Sending...");try{await this._writeAdminNotification("help",{message:t,room:this._getCurrentRoom()}),await this._pushAdmins("🆘 Help Request",`${this._senderName()} needs help: "${t.substring(0,80)}"`),window.Core.showToast("Your message was sent to the admin"),document.getElementById("helpMeText").value="",document.getElementById("helpMePanel").style.display="none",this.closeModal("help")}catch(n){console.error("submitHelpMe error:",n),window.Core.showToast("Could not send - please try again")}finally{e&&(e.disabled=!1,e.textContent="Send to Admin")}},async submitModeratorRequest(){var i,o,n;const t=(i=document.getElementById("moderatorUrgency"))==null?void 0:i.value,e=(n=(o=document.getElementById("moderatorMessage"))==null?void 0:o.value)==null?void 0:n.trim();try{await this._writeAdminNotification("moderator",{urgency:t,message:e,room:this._getCurrentRoom()}),await this._pushAdmins("👥 Moderator Request",`${this._senderName()} [${t}]: ${e?e.substring(0,80):"-"}`),window.Core.showToast("Moderator contacted"),this.closeModal("moderator")}catch(r){console.error("submitModeratorRequest error:",r),window.Core.showToast("Could not send - please try again")}},async submitTechnicalIssue(){var o,n,r,a,s,l,d;const t=(o=document.getElementById("technicalType"))==null?void 0:o.value,e=(r=(n=document.getElementById("technicalDescription"))==null?void 0:n.value)==null?void 0:r.trim(),i=(s=(a=document.getElementById("technicalDevice"))==null?void 0:a.value)==null?void 0:s.trim();(d=(l=window.Community)==null?void 0:l.submitTechnicalIssue)==null||d.call(l);try{await this._writeAdminNotification("technical",{issueType:t,description:e,device:i,room:this._getCurrentRoom()}),await this._pushAdmins("🔧 Technical Issue",`${this._senderName()}: ${t||"issue"}${e?" - "+e.substring(0,60):""}`)}catch(c){console.error("submitTechnicalIssue admin notify error:",c)}},async _writeAdminNotification(t,e){if(!(u!=null&&u.ready))return;const{error:i}=await u._sb.from("admin_notifications").insert({type:t,from_user_id:u.userId||null,payload:{...e,sender_name:this._senderName(),timestamp:new Date().toISOString()}});i&&console.error("[SafetyBar] _writeAdminNotification:",i.message)},async _pushAdmins(t,e){if(u!=null&&u.ready)try{const[{data:i}]=await Promise.all([u._sb.from("profiles").select("id").eq("is_admin",!0)]);if(!(i!=null&&i.length))return;const{data:o}=await u._sb.from("push_subscriptions").select("subscription").in("user_id",i.map(n=>n.id));if(!(o!=null&&o.length))return;await Promise.allSettled(o.map(n=>fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sub:n.subscription,payload:{title:t,body:e,icon:"/icons/icon-192x192.png",data:{url:"/"}}})}).catch(()=>{})))}catch(i){console.error("[SafetyBar] _pushAdmins error:",i)}},_getCurrentRoom(){var t,e;return((e=(t=document.querySelector(".room-title, .room-name-inline, #roomTitle"))==null?void 0:t.textContent)==null?void 0:e.trim())||"Community Hub"},_senderName(){var t,e,i;return((i=(e=(t=window.Core)==null?void 0:t.state)==null?void 0:e.currentUser)==null?void 0:i.name)||"A member"}};(function(){const t={showReportModal:()=>N.openModal("report"),showBlockModal:()=>N.openModal("block"),showHelpModal:()=>N.openModal("help"),showCrisisModal:()=>N.openModal("crisis"),showModeratorModal:()=>N.openModal("moderator"),showTechnicalModal:()=>N.openModal("technical"),showGuidelinesModal:()=>N.openModal("guidelines"),muteChat:()=>{var e,i;return(i=(e=window.Core)==null?void 0:e.showToast)==null?void 0:i.call(e,"Chat muted")},closeReportModal:()=>N.closeModal("report"),closeBlockModal:()=>N.closeModal("block"),closeHelpModal:()=>N.closeModal("help"),closeCrisisModal:()=>N.closeModal("crisis"),closeModeratorModal:()=>N.closeModal("moderator"),closeTechnicalModal:()=>N.closeModal("technical"),closeGuidelinesModal:()=>N.closeModal("guidelines")};window.CommunityModule?Object.keys(t).forEach(e=>{typeof window.CommunityModule[e]!="function"&&(window.CommunityModule[e]=t[e])}):window.CommunityModule=t})();window.SafetyBar=N;const Pe=[{id:"early_supporter",icon:"🌟",name:"Early Supporter",rarity:"epic",xp:100,desc:"Joined during early access"},{id:"vip_member",icon:"👑",name:"VIP Member",rarity:"legendary",xp:150,desc:"VIP community member"},{id:"beta_tester",icon:"🧪",name:"Beta Tester",rarity:"rare",xp:100,desc:"Helped test new features"},{id:"spiritual_guide",icon:"🕉️",name:"Spiritual Guide",rarity:"epic",xp:150,desc:"Community mentor and guide"},{id:"community_hero",icon:"🦸",name:"Community Hero",rarity:"legendary",xp:200,desc:"Outstanding community contribution"},{id:"first_step",icon:"🌱",name:"First Step",rarity:"common",xp:25,desc:"Took their first step in the community"},{id:"triple_threat",icon:"🎪",name:"Triple Threat",rarity:"uncommon",xp:50,desc:"Active in three different rooms"},{id:"moon_walker",icon:"🌙",name:"Moon Walker",rarity:"rare",xp:75,desc:"Night-time community explorer"},{id:"sun_keeper",icon:"☀️",name:"Sun Keeper",rarity:"uncommon",xp:50,desc:"Consistent morning presence"},{id:"energy_master",icon:"⚡",name:"Energy Master",rarity:"epic",xp:125,desc:"Master of community energy"},{id:"wave_rider",icon:"🌊",name:"Wave Rider",rarity:"rare",xp:75,desc:"Goes with the flow"},{id:"community_heart",icon:"💜",name:"Community Heart",rarity:"uncommon",xp:50,desc:"Heart of the community"},{id:"deep_diver",icon:"🔱",name:"Deep Diver",rarity:"epic",xp:125,desc:"Explores the depths of every topic"}];window.BADGE_REGISTRY=Pe;const $t=["🏅","🎖️","🌟","👑","🧪","🕉️","🦸","🌱","🎪","🌙","☀️","⚡","🌊","💜","🔱","🔥","💎","🦋","🌸","🍀","🌈","⭐","🎯","🏆","🎗️","🌀","🔮","💫","🧘","🦅","🐉","🌺","🎵","💡","🌿","🦁","🐬","🌍","🎭","🛡️","⚔️","🗝️","🧬","🌠","🎋"],Et={_open:!1,_pollInterval:null,_bulkMembers:[],_bulkSelected:new Set,_SECTIONS:["notifications","members","engagement","safety","leaderboard","rooms","retention","bulk"],_BULK_TABS:[["xp","🎁 XP"],["karma","🌀 Karma"],["badge","🏅 Badge"],["customBadge","✨ Custom Badge"],["unlock","🔓 Unlock"],["message","💬 Message"]],_UNLOCKS:[["tarot_vision_ai","Tarot Vision AI"],["shadow_alchemy_lab","Shadow Alchemy Lab"],["advanced_meditations","Advanced Meditations"],["luxury_blush_champagne_skin","Blush Champagne Skin"],["luxury_champagne_gold_skin","Champagne Gold Skin"],["luxury_marble_bronze_skin","Marble Bronze Skin"],["royal_indigo_skin","Royal Indigo Skin"],["earth_luxury_skin","Earth Luxury Skin"]],_NOTIF_ICONS:{report:"⚠️",help:"🆘",technical:"🔧"},_buildEmojiPicker(t,e){return`
            <div id="${e}"
                 style="display:none;flex-wrap:wrap;gap:4px;padding:8px;border-radius:10px;
                        border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);
                        max-height:130px;overflow-y:auto;margin-bottom:10px;">
                ${$t.map(i=>`<button type="button"
                             onclick="AdminDashboard._pickEmoji('${t}','${e}','${i}')"
                             style="font-size:1.25rem;background:none;border:none;cursor:pointer;
                                    padding:3px 5px;border-radius:6px;line-height:1;transition:background 0.1s;"
                             onmouseover="this.style.background='rgba(0,0,0,0.07)'"
                             onmouseout="this.style.background='none'">${i}</button>`).join("")}
            </div>`},_pickEmoji(t,e,i){const o=document.getElementById(t);o&&(o.value=i);const n=document.getElementById(e);n&&(n.style.display="none")},_toggleEmojiPicker(t){const e=document.getElementById(t);e&&(e.style.display=e.style.display==="none"?"flex":"none")},async _pushNotify(t,e,i){try{await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:t,payload:{title:e,body:i,icon:"/icons/icon-192x192.png",data:{url:"/"}}})})}catch(o){console.error("[AdminDashboard] push notify error:",o)}},_injectStyles(){if(document.getElementById("adminDashStyles"))return;const t=document.createElement("style");t.id="adminDashStyles",t.textContent=`
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
        `,document.head.appendChild(t)},injectAdminUI(){var t,e,i;(i=(e=(t=window.Core)==null?void 0:t.state)==null?void 0:e.currentUser)!=null&&i.is_admin&&this.injectBadge()},injectBadge(){var o,n,r;if(document.getElementById("adminDashBadge")||!((r=(n=(o=window.Core)==null?void 0:o.state)==null?void 0:n.currentUser)!=null&&r.is_admin))return;this._injectStyles();const t=document.createElement("div");t.id="adminDashBadge",t.style.cssText="padding:0 0 32px;",t.innerHTML=`
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
            </section>`;const e=document.getElementById("upcomingEventsContainer"),i=document.querySelector(".sanctuary-content");(e??i??document.body).insertAdjacentElement(e?"afterend":"beforeend",t),this._startBadgePoll()},async _updateBadge(){const t=await CommunityDB.getUnreadNotificationCount(),e=document.getElementById("adminDashUnreadBadge");e&&(e.textContent=t>99?"99+":t,e.style.display=t>0?"block":"none")},_startBadgePoll(){this._updateBadge(),this._pollInterval=setInterval(()=>this._updateBadge(),6e4)},openDashboard(){if(document.getElementById("adminDashOverlay"))return;this._open=!0;const t=document.createElement("div");t.id="adminDashOverlay",t.style.cssText="position:fixed;inset:0;z-index:99999;background:var(--neuro-bg,#f0f0f3);overflow-y:auto;font-family:var(--font-body,sans-serif);",t.innerHTML=`
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
                ${this._SECTIONS.map((e,i)=>this._sectionShell(e,this._sectionTitle(e),i===0)).join("")}
            </div>`,document.body.appendChild(t),document.body.style.overflow="hidden",this.refreshAll()},closeDashboard(){var t;(t=document.getElementById("adminDashOverlay"))==null||t.remove(),document.body.style.overflow="",this._open=!1,this._updateBadge()},_sectionTitle(t){return{notifications:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Notifications',members:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Members',engagement:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Community Engagement',safety:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Safety & Stats',leaderboard:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> Leaderboard',rooms:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg> Room Usage Today',retention:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Retention Signals',bulk:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Bulk Actions'}[t]||t},_sectionShell(t,e,i=!1){return`
        <div style="margin-bottom:12px;">
            <div class="admin-section-header" onclick="AdminDashboard.toggleSection('${t}')">
                <span style="font-size:0.92rem;font-weight:700;color:var(--neuro-text,#333);">${e}</span>
                <span id="adminSecToggle_${t}" style="font-size:0.8rem;color:var(--neuro-accent);">${i?"▼":"▶"}</span>
            </div>
            <div id="adminSec_${t}" class="admin-section-body" style="display:${i?"block":"none"};">
                <div id="adminSecContent_${t}" style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>
            </div>
        </div>`},toggleSection(t){const e=document.getElementById(`adminSec_${t}`),i=document.getElementById(`adminSecToggle_${t}`);if(!e)return;const o=e.style.display!=="none";e.style.display=o?"none":"block",i.textContent=o?"▶":"▼",o||this._loadSection(t)},refreshAll(){const t=document.getElementById("adminDashSubtitle");t&&(t.textContent=`Last updated: ${new Date().toLocaleTimeString()}`);for(const e of this._SECTIONS){const i=document.getElementById(`adminSec_${e}`);i&&(i.style.display!=="none"||e==="notifications")&&this._loadSection(e)}},async _loadSection(t){const e=document.getElementById(`adminSecContent_${t}`);if(e){e.innerHTML='<div style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>';try{await this[`_render${t.charAt(0).toUpperCase()+t.slice(1)}`](e)}catch(i){e.innerHTML=`<div style="color:#ef4444;font-size:0.83rem;padding:8px;">Failed to load: ${this._esc(i.message)}</div>`}}},async _renderNotifications(t){const e=await CommunityDB.getAdminNotifications(30);if(!e.length){t.innerHTML='<div style="color:var(--text-muted,#888);padding:8px;font-size:0.83rem;">No notifications yet.</div>';return}const i=e.filter(o=>!o.read).length;t.innerHTML=`
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:0.82rem;color:var(--text-muted,#888);">${i} unread of ${e.length}</span>
                <button onclick="AdminDashboard._markAllRead()"
                        style="padding:4px 12px;border-radius:99px;border:1px solid var(--neuro-accent-a30);
                               background:var(--neuro-accent-a08);color:var(--neuro-accent);
                               font-size:0.78rem;cursor:pointer;">Mark all read</button>
            </div>
            ${e.map(o=>{var n,r,a,s,l,d,c;return`
                <div class="admin-notif-row ${o.read?"":"unread"}" id="adminNotif_${o.id}">
                    <span style="font-size:1.2rem;flex-shrink:0;">${this._NOTIF_ICONS[o.type]||"📋"}</span>
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                            <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize;">${o.type}</span>
                            <span style="font-size:0.72rem;color:var(--text-muted,#888);">${this._timeAgo(o.created_at)}</span>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text-muted,#888);">
                            From: <strong>${((n=o.payload)==null?void 0:n.sender_name)||"Unknown"}</strong>
                            ${(r=o.payload)!=null&&r.room?`· ${o.payload.room}`:""}
                        </div>
                        ${(a=o.payload)!=null&&a.message?`<div style="font-size:0.82rem;margin-top:4px;font-style:italic;">"${this._esc(o.payload.message)}"</div>`:""}
                        ${(s=o.payload)!=null&&s.reason?`<div style="font-size:0.82rem;margin-top:4px;">Reason: ${this._esc(o.payload.reason)}</div>`:""}
                        ${(l=o.payload)!=null&&l.details?`<div style="font-size:0.82rem;color:var(--text-muted,#888);">${this._esc(o.payload.details)}</div>`:""}
                        ${(d=o.payload)!=null&&d.issueType?`<div style="font-size:0.82rem;margin-top:4px;">Type: ${this._esc(o.payload.issueType)}</div>`:""}
                        ${(c=o.payload)!=null&&c.description?`<div style="font-size:0.82rem;color:var(--text-muted,#888);">${this._esc(o.payload.description)}</div>`:""}
                    </div>
                    ${o.read?"":`
                    <button onclick="AdminDashboard._markRead(${o.id})"
                            style="flex-shrink:0;padding:3px 8px;border-radius:6px;border:none;cursor:pointer;
                                   font-size:0.72rem;background:var(--neuro-accent-a10);color:var(--neuro-accent);">
                        ✓ Read
                    </button>`}
                </div>`}).join("")}`},async _renderMembers(t){const[e,i,{data:o=[]}]=await Promise.all([CommunityDB.getAdminMemberStats(),CommunityDB.getActiveMembers(),CommunityDB._sb.from("profiles").select("id, name, emoji, avatar_url, community_status").order("name")]),n=Object.fromEntries(i.map(l=>[l.user_id,l])),r=new Set(i.map(l=>l.user_id)),a=o.filter(l=>!r.has(l.id)),s=(l,d)=>{const c=(d==null?void 0:d.status)||"offline",p=(d==null?void 0:d.activity)||"💤 Offline",h=c==="online"?"#22c55e":c==="away"?"#f59e0b":"#aaa";return`
                <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);cursor:pointer;"
                     onclick="MemberProfileModal?.open('${l.id}')">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:${window.Core.getAvatarGradient(l.id)};
                                display:flex;align-items:center;justify-content:center;
                                font-size:0.9rem;color:#fff;flex-shrink:0;overflow:hidden;">
                        ${l.avatar_url?`<img src="${l.avatar_url}" alt="Member avatar" width="40" height="40" style="width:100%;height:100%;object-fit:cover;" loading="lazy" decoding="async">`:l.emoji||(l.name||"?").charAt(0)}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:0.85rem;font-weight:600;">${this._esc(l.name||"Member")}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted,#888);">${this._esc(p)}</div>
                    </div>
                    <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${h};"></span>
                </div>`};t.innerHTML=`
            <div class="admin-stat-grid" style="margin-bottom:16px;">
                ${this._statCard(e.total||0,"Total Members")}
                ${this._statCard(e.onlineNow||0,"Online Now")}
                ${this._statCard(e.newThisWeek||0,"New This Week")}
                ${this._statCard(a.length,"Offline")}
            </div>
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin-bottom:8px;">🟢 Online & Away</div>
            ${i.length?i.map(l=>s(l.profiles||{id:l.user_id,name:"Member"},l)).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;margin-bottom:12px;">No members online.</div>'}
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin:12px 0 8px;">⚫ Offline (${a.length})</div>
            ${a.map(l=>s(l,n[l.id]||null)).join("")}`},async _renderEngagement(t){const e=await CommunityDB.getAdminEngagementStats();t.innerHTML=`
            <div class="admin-stat-grid">
                ${this._statCard(e.reflectionsToday||0,"Reflections Today")}
                ${this._statCard(e.reflectionsTotal||0,"Reflections Total")}
                ${this._statCard(e.whispersToday||0,"Whispers Today")}
                ${this._statCard(e.appreciationsToday||0,"Appreciations Today")}
            </div>`},async _renderSafety(t){const[e,i]=await Promise.all([CommunityDB.getSafetyStats(),CommunityDB.getPushSubscriptionCount()]);t.innerHTML=`
            <div class="admin-stat-grid">
                ${this._statCard(e.unreadNotifs||0,"Unread Notifications")}
                ${this._statCard(e.reportsThisWeek||0,"Reports This Week")}
                ${this._statCard(e.blockedTotal||0,"Blocked Relationships")}
                ${this._statCard(i||0,"Push Subscriptions")}
            </div>`},async _renderLeaderboard(t){const e=await CommunityDB.getLeaderboard(),i=(o,n)=>o.length?o.map((r,a)=>{var s,l,d;return`
                <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);">
                    <span style="font-size:1rem;">${["🥇","🥈","🥉"][a]||"·"}</span>
                    <span style="font-size:0.9rem;">${((s=r.profiles)==null?void 0:s.emoji)||""}</span>
                    <span style="flex:1;font-size:0.85rem;font-weight:600;">${this._esc(((l=r.profiles)==null?void 0:l.name)||"Member")}</span>
                    <span style="font-size:0.85rem;font-weight:700;color:var(--neuro-accent);">${((d=r.payload)==null?void 0:d[n])||0}</span>
                </div>`}).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;">No data yet.</div>';t.innerHTML=`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">⭐ Top XP</div>
                    ${i(e.xp,"xp")}
                </div>
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">🌀 Top Karma</div>
                    ${i(e.karma,"karma")}
                </div>
            </div>`},async _renderRooms(t){const e=await CommunityDB.getRoomUsageToday();if(!e.length){t.innerHTML='<div style="color:var(--text-muted,#888);font-size:0.83rem;">No room entries logged today yet.</div>';return}t.innerHTML=`
            <table class="admin-table">
                <thead><tr><th>Room</th><th>Entries</th><th>Avg Duration</th></tr></thead>
                <tbody>
                    ${e.map(i=>{const o=i.entries>0?Math.round(i.totalSeconds/i.entries):0;return`<tr>
                            <td style="font-weight:600;">${this._formatRoomId(i.room_id)}</td>
                            <td>${i.entries}</td>
                            <td>${this._formatDuration(o)}</td>
                        </tr>`}).join("")}
                </tbody>
            </table>`},async _renderRetention(t){var i,o;const e=await CommunityDB.getRetentionSignals();t.innerHTML=`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">😶 Going Quiet</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;">Active last week, not this week</div>
                    ${(i=e.quietMembers)!=null&&i.length?e.quietMembers.map(n=>`
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
                    ${(o=e.streakMembers)!=null&&o.length?e.streakMembers.map(n=>`
                            <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;
                                        margin-bottom:4px;background:rgba(34,197,94,0.06);
                                        border:1px solid rgba(34,197,94,0.15);cursor:pointer;"
                                 onclick="MemberProfileModal?.open('${n.user_id}')">
                                <span>${n.emoji||"🧘"}</span>
                                <span style="font-size:0.83rem;font-weight:600;">${this._esc(n.name||"Member")}</span>
                            </div>`).join(""):'<div style="color:var(--text-muted,#888);font-size:0.83rem;">No data yet.</div>'}
                </div>
            </div>`},async _renderBulk(t){const{data:e=[]}=await CommunityDB._sb.from("profiles").select("id, name, emoji, avatar_url, community_role").order("name");this._bulkMembers=e,this._bulkSelected=new Set;const i=Pe.map(l=>`<option value="${l.id}" data-icon="${l.icon}" data-rarity="${l.rarity}" data-xp="${l.xp}" data-desc="${l.desc}">${l.icon} ${l.name}</option>`).join(""),o="width:100%;padding:8px 12px;border-radius:10px;margin-bottom:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;",n="width:100%;padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);",r="flex:1;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;",a="width:100%;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;box-sizing:border-box;margin-bottom:8px;",s="font-size:0.82rem;color:var(--text-muted,#888);margin-bottom:8px;";t.innerHTML=`
            <div style="margin-bottom:16px;">

                <!-- Member selector -->
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
                        ${this._bulkMembers.map(l=>`
                            <label id="bulkRow_${l.id}"
                                   style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background 0.1s;"
                                   onmouseover="this.style.background='var(--neuro-accent-a08)'"
                                   onmouseout="this.style.background='none'">
                                <input type="checkbox" value="${l.id}"
                                       onchange="AdminDashboard._bulkToggle('${l.id}',this.checked)"
                                       style="width:16px;height:16px;cursor:pointer;accent-color:var(--neuro-accent);">
                                <span style="font-size:1.1rem;">${l.emoji||"👤"}</span>
                                <span style="font-size:0.85rem;font-weight:600;color:var(--neuro-text);">${this._esc(l.name||"Member")}</span>
                                <span style="font-size:0.75rem;color:var(--text-muted,#888);margin-left:auto;">${this._esc(l.community_role||"Member")}</span>
                            </label>`).join("")}
                    </div>
                    <div id="bulkSelectedCount" style="font-size:0.78rem;color:var(--text-muted,#888);margin-top:6px;text-align:right;">0 members selected</div>
                </div>

                <div style="border-top:1px solid rgba(0,0,0,0.07);margin:16px 0;"></div>

                <!-- Tab bar -->
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;" id="bulkTabBar">
                    ${this._BULK_TABS.map(([l,d],c)=>`
                        <button onclick="AdminDashboard._bulkShowTab('${l}')" id="bulkTab_${l}"
                                style="padding:6px 14px;border-radius:99px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:all 0.15s;
                                       ${c===0?"background:var(--neuro-accent-a20);color:var(--neuro-accent);":"background:rgba(0,0,0,0.05);color:var(--text-muted,#888);"}">
                            ${d}
                        </button>`).join("")}
                </div>

                <!-- XP panel -->
                <div id="bulkPanel_xp">
                    <div style="${s}">Send XP to all selected members</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="bulkXpAmount" type="number" min="1" value="100" placeholder="XP amount" style="${r}">
                        <button onclick="AdminDashboard._bulkSendXP()" style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send XP</button>
                    </div>
                </div>

                <!-- Karma panel -->
                <div id="bulkPanel_karma" style="display:none;">
                    <div style="${s}">Send Karma to all selected members</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="bulkKarmaAmount" type="number" min="1" value="10" placeholder="Karma amount" style="${r}">
                        <button onclick="AdminDashboard._bulkSendKarma()" style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send Karma</button>
                    </div>
                </div>

                <!-- Badge panel -->
                <div id="bulkPanel_badge" style="display:none;">
                    <div style="${s}">Send a badge to all selected members</div>
                    <select id="bulkBadgeSelect" style="${o}">
                        ${i}
                    </select>
                    <button onclick="AdminDashboard._bulkSendBadge()" style="${n}">Send Badge</button>
                </div>

                <!-- Custom Badge panel -->
                <div id="bulkPanel_customBadge" style="display:none;">
                    <div style="${s}">Create and send a custom badge to all selected members</div>

                    <!-- Emoji row -->
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

                    <input type="text" id="bulkCustomName" maxlength="40" placeholder="Badge name"
                           style="${a}">
                    <textarea id="bulkCustomDesc" placeholder="Description (optional)" maxlength="120" rows="2"
                              style="${a}resize:none;"></textarea>

                    <select id="bulkCustomRarity" style="${o}">
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="epic" selected>Epic</option>
                        <option value="legendary">Legendary</option>
                    </select>

                    <!-- XP + Karma side by side -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px;">
                        <input type="number" id="bulkCustomXp"    min="0" value="100" placeholder="XP reward"
                               style="padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;box-sizing:border-box;">
                        <input type="number" id="bulkCustomKarma" min="0" value="15"  placeholder="Karma reward"
                               style="padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;box-sizing:border-box;">
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;font-size:0.72rem;
                                color:var(--text-muted,#888);text-align:center;margin-bottom:10px;">
                        <span>XP reward</span><span>Karma reward</span>
                    </div>

                    <button onclick="AdminDashboard._bulkSendCustomBadge()" style="${n}">Send Custom Badge</button>
                </div>

                <!-- Unlock panel -->
                <div id="bulkPanel_unlock" style="display:none;">
                    <div style="${s}">Unlock a feature for all selected members</div>
                    <select id="bulkUnlockSelect" style="${o}">
                        ${this._UNLOCKS.map(([l,d])=>`<option value="${l}">${d}</option>`).join("")}
                    </select>
                    <button onclick="AdminDashboard._bulkSendUnlock()" style="${n}">Unlock Feature</button>
                </div>

                <!-- Message panel -->
                <div id="bulkPanel_message" style="display:none;">
                    <div style="${s}">Broadcast a message - appears in recipients' Whispers inbox</div>
                    <textarea id="bulkMessageText" placeholder="Write your message..." rows="4"
                              style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;resize:vertical;box-sizing:border-box;margin-bottom:10px;"></textarea>
                    <button onclick="AdminDashboard._bulkSendMessage()" style="${n}">Send Message</button>
                </div>

            </div>`},_bulkToggle(t,e){this._bulkSelected[e?"add":"delete"](t),this._bulkUpdateCount()},_bulkSelectAll(){for(const t of this._bulkMembers){this._bulkSelected.add(t.id);const e=document.querySelector(`#bulkRow_${t.id} input[type=checkbox]`);e&&(e.checked=!0)}this._bulkUpdateCount()},_bulkSelectNone(){this._bulkSelected.clear(),document.querySelectorAll("#bulkMemberList input[type=checkbox]").forEach(t=>t.checked=!1),this._bulkUpdateCount()},_bulkUpdateCount(){const t=this._bulkSelected.size,e=document.getElementById("bulkSelectedCount");e&&(e.textContent=`${t} member${t!==1?"s":""} selected`)},_bulkFilterMembers(t){const e=t.toLowerCase();document.querySelectorAll("#bulkMemberList label").forEach(i=>{var n,r;const o=((r=(n=i.querySelector("span:nth-child(3)"))==null?void 0:n.textContent)==null?void 0:r.toLowerCase())||"";i.style.display=o.includes(e)?"":"none"})},_bulkShowTab(t){for(const[e]of this._BULK_TABS){const i=document.getElementById(`bulkPanel_${e}`),o=document.getElementById(`bulkTab_${e}`);if(!i||!o)continue;const n=e===t;i.style.display=n?"block":"none",o.style.background=n?"var(--neuro-accent-a20)":"rgba(0,0,0,0.05)",o.style.color=n?"var(--neuro-accent)":"var(--text-muted,#888)"}},_bulkGuard(){return this._bulkSelected.size===0?(window.Core.showToast("Select at least one member first"),!1):!0},async _bulkSendGamification({inputId:t,label:e,xpDelta:i=0,karmaDelta:o=0,notifTitle:n,notifBody:r}){var d;if(!this._bulkGuard())return;const a=parseInt((d=document.getElementById(t))==null?void 0:d.value,10);if(!a||a<1){window.Core.showToast(`Enter a valid ${e} amount`);return}const s=[...this._bulkSelected];window.Core.showToast(`Sending ${a} ${e} to ${s.length} members...`);let l=0;for(const c of s)try{await CommunityDB.adminUpdateGamification(c,{xpDelta:i==="amount"?a:i,karmaDelta:o==="amount"?a:o})?(l++,await this._pushNotify(c,n,r(a))):console.warn("[AdminDashboard] _bulkSendGamification: no success for",c)}catch(p){console.error("[AdminDashboard] _bulkSendGamification error for",c,p)}window.Core.showToast(`Sent ${a} ${e} to ${l}/${s.length} members`)},async _bulkSendXP(){await this._bulkSendGamification({inputId:"bulkXpAmount",label:"XP",xpDelta:"amount",notifTitle:"🎁 Gift from Aanandoham!",notifBody:t=>`You received +${t} XP!`})},async _bulkSendKarma(){await this._bulkSendGamification({inputId:"bulkKarmaAmount",label:"Karma",karmaDelta:"amount",notifTitle:"🎁 Gift from Aanandoham!",notifBody:t=>`You received +${t} Karma!`})},async _bulkSendBadge(){if(!this._bulkGuard())return;const t=document.getElementById("bulkBadgeSelect"),e=t==null?void 0:t.value;if(!e){window.Core.showToast("Select a badge");return}const i=Pe.find(c=>c.id===e)||{},o=i.name||e,n=i.icon||"🏅",r=i.rarity||"common",a=i.xp??0,s=i.desc||"",l=[...this._bulkSelected];window.Core.showToast(`Sending badge to ${l.length} members...`);let d=0;for(const c of l)try{await CommunityDB.adminUpdateGamification(c,{badgeId:e,badgeName:o,badgeIcon:n,badgeRarity:r,badgeXp:a,badgeDesc:s})?(d++,await this._pushNotify(c,"🏅 New Badge!",`You earned the ${n} ${o} badge!`)):console.warn("[AdminDashboard] _bulkSendBadge: no success for",c)}catch(p){console.error("[AdminDashboard] _bulkSendBadge error for",c,p)}window.Core.showToast(`Sent badge to ${d}/${l.length} members`)},async _bulkSendCustomBadge(){var d,c,p,h,m,g;if(!this._bulkGuard())return;const t=((d=document.getElementById("bulkCustomIcon"))==null?void 0:d.value.trim())||"🏅",e=(c=document.getElementById("bulkCustomName"))==null?void 0:c.value.trim(),i=((p=document.getElementById("bulkCustomDesc"))==null?void 0:p.value.trim())||"",o=((h=document.getElementById("bulkCustomRarity"))==null?void 0:h.value)||"epic",n=parseInt((m=document.getElementById("bulkCustomXp"))==null?void 0:m.value,10)||0,r=parseInt((g=document.getElementById("bulkCustomKarma"))==null?void 0:g.value,10)||0;if(!e){window.Core.showToast("Please enter a badge name");return}const a="custom_"+e.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")+"_"+Date.now(),s=[...this._bulkSelected];window.Core.showToast(`Sending custom badge to ${s.length} members...`);let l=0;for(const f of s)try{await CommunityDB.adminUpdateGamification(f,{badgeId:a,badgeName:e,badgeIcon:t,badgeRarity:o,badgeXp:n,badgeDesc:i})?(r>0&&await CommunityDB.adminUpdateGamification(f,{karmaDelta:r}),l++,await this._pushNotify(f,"🎖️ Special Badge!",`You received the ${t} ${e} badge!`)):console.warn("[AdminDashboard] _bulkSendCustomBadge: no success for",f)}catch(b){console.error("[AdminDashboard] _bulkSendCustomBadge error for",f,b)}window.Core.showToast(`Sent custom badge to ${l}/${s.length} members`)},async _bulkSendUnlock(){var r;if(!this._bulkGuard())return;const t=document.getElementById("bulkUnlockSelect"),e=t==null?void 0:t.value,i=((r=t==null?void 0:t.options[t.selectedIndex])==null?void 0:r.text)||e;if(!e){window.Core.showToast("Select a feature");return}const o=[...this._bulkSelected];window.Core.showToast(`Unlocking ${i} for ${o.length} members...`);let n=0;for(const a of o)try{await CommunityDB.adminUpdateGamification(a,{unlockFeature:e})?(n++,await this._pushNotify(a,"🔓 Feature Unlocked!",`${i} has been unlocked for you!`)):console.warn("[AdminDashboard] _bulkSendUnlock: no success for",a)}catch(s){console.error("[AdminDashboard] _bulkSendUnlock error for",a,s)}window.Core.showToast(`Unlocked ${i} for ${n}/${o.length} members`)},async _bulkSendMessage(){var o,n;if(!this._bulkGuard())return;const t=(n=(o=document.getElementById("bulkMessageText"))==null?void 0:o.value)==null?void 0:n.trim();if(!t){window.Core.showToast("Write a message first");return}const e=[...this._bulkSelected];window.Core.showToast(`Broadcasting to ${e.length} members...`);let i={sent:0};try{i=await CommunityDB.broadcastMessage(e,t)}catch(r){console.error("[AdminDashboard] _bulkSendMessage error:",r),window.Core.showToast("Failed to send messages");return}if(i.sent>0){for(const r of e)await this._pushNotify(r,"💬 Message from Aanandoham",t.substring(0,80));document.getElementById("bulkMessageText").value="",window.Core.showToast(`Message sent to ${i.sent}/${e.length} members`)}else window.Core.showToast("Failed to send messages")},async _markRead(t){var i;await CommunityDB.markNotificationRead(t);const e=document.getElementById(`adminNotif_${t}`);e&&(e.classList.remove("unread"),(i=e.querySelector("button"))==null||i.remove()),this._updateBadge()},async _markAllRead(){await CommunityDB.markAllNotificationsRead(),this._loadSection("notifications"),this._updateBadge()},async _deleteReflection(t,e){var o;if(!confirm("Delete this reflection?"))return;e.disabled=!0,await CommunityDB.deleteReflection(t)?((o=e.closest(".admin-refl-row"))==null||o.remove(),window.Core.showToast("Reflection deleted")):(window.Core.showToast("Could not delete"),e.disabled=!1)},_statCard(t,e){return`
            <div class="admin-stat-card">
                <div class="admin-stat-value">${t}</div>
                <div class="admin-stat-label">${e}</div>
            </div>`},_timeAgo(t){if(!t)return"";const e=Date.now()-new Date(t).getTime(),i=Math.floor(e/6e4),o=Math.floor(e/36e5),n=Math.floor(e/864e5);return i<1?"just now":i<60?`${i}m ago`:o<24?`${o}h ago`:`${n}d ago`},_formatDuration(t){return t?t<60?`${t}s`:t<3600?`${Math.round(t/60)}m`:`${(t/3600).toFixed(1)}h`:"-"},_formatRoomId(t){return(t||"").replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase())},_esc(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}};window.AdminDashboard=Et;const X=()=>window.CollectiveField,Ee=()=>{var t,e,i,o;return((t=window.CommunityDB)==null?void 0:t.userId)||((o=(i=(e=window.Core)==null?void 0:e.state)==null?void 0:i.currentUser)==null?void 0:o.id)||null},ge={_realtimeChannels:{},_pollInterval:null,POLL_INTERVAL_MS:3e4,async init(){try{await this._ensureTodayRow(),await this.loadAll(),this._subscribeRealtime(),this._startPolling()}catch(t){console.error("[CollectiveFieldDB] init error:",t)}},async loadAll(){await Promise.all([this.loadFieldState(),this.loadRecentSenders(),this.loadWaveTotal(),this.loadWaveParticipants(),this.loadUserContribution()])},get _sb(){return window.AppSupabase||window.CommunitySupabase||null},_todayUTC(){return new Date().toISOString().slice(0,10)},_err(t,e){console.error(`[CollectiveFieldDB] ${t}:`,e)},async _ensureTodayRow(){const t=this._todayUTC(),{data:e,error:i}=await this._sb.from("collective_field").select("id").eq("date",t).maybeSingle();if(i)throw i;if(!e){const{error:o}=await this._sb.from("collective_field").insert({date:t,energy_level:0,pulse_count_today:0});if(o)throw o}},async loadFieldState(){const{data:t,error:e}=await this._sb.from("collective_field").select("energy_level, pulse_count_today").eq("date",this._todayUTC()).single();if(e){this._err("loadFieldState",e);return}X().updateEnergyLevel(t.energy_level),X().updateCommunityPulseCount(t.pulse_count_today)},async loadRecentSenders(){const{data:t,error:e}=await this._sb.from("collective_pulses").select("user_id, profiles(emoji, avatar_url)").eq("date",this._todayUTC()).order("created_at",{ascending:!1}).limit(5);if(e){this._err("loadRecentSenders",e);return}X().updateRecentSenders((t||[]).map(i=>{var o,n;return{emoji:((o=i.profiles)==null?void 0:o.emoji)||"🧘",avatarUrl:((n=i.profiles)==null?void 0:n.avatar_url)||null}}))},async recordPulse(){const t=Ee();if(!t){this._err("recordPulse","no userId");return}const e=this._todayUTC(),{error:i}=await this._sb.rpc("increment_field_pulse",{p_date:e,p_energy_add:5});if(i){this._err("recordPulse RPC",i);return}const{error:o}=await this._sb.from("collective_pulses").insert({user_id:t,date:e});o&&this._err("recordPulse insert",o)},async loadWaveTotal(){const{data:t,error:e}=await this._sb.from("wave_contributions").select("minutes").eq("date",this._todayUTC());if(e){this._err("loadWaveTotal",e);return}X().updateWaveTotalMinutes((t||[]).reduce((i,o)=>i+(o.minutes||0),0))},async loadWaveParticipants(){const{data:t,error:e}=await this._sb.from("wave_contributions").select("user_id").eq("date",this._todayUTC());if(e){this._err("loadWaveParticipants",e);return}X().updateWaveParticipants(new Set((t||[]).map(i=>i.user_id)).size)},async loadUserContribution(){const t=Ee();if(!t)return;const e=this._todayUTC(),[{data:i,error:o},{data:n,error:r}]=await Promise.all([this._sb.from("wave_contributions").select("minutes").eq("user_id",t).eq("date",e),this._sb.from("wave_contributions").select("minutes").eq("user_id",t)]);if(o){this._err("loadUserContribution today",o);return}if(r){this._err("loadUserContribution allTime",r);return}const a=s=>(s||[]).reduce((l,d)=>l+(d.minutes||0),0);X().updateUserContribution(a(i),a(n))},async logWaveContribution(t,e){const i=Ee();if(!i){this._err("logWaveContribution","no userId");return}if(t<1)return;const{error:o}=await this._sb.from("wave_contributions").insert({user_id:i,date:this._todayUTC(),minutes:t,completed:e});if(o){this._err("logWaveContribution",o);return}await Promise.all([this.loadWaveTotal(),this.loadWaveParticipants()])},_subscribeRealtime(){const t=this._todayUTC();this._realtimeChannels.field=this._sb.channel("collective_field_changes").on("postgres_changes",{event:"UPDATE",schema:"public",table:"collective_field",filter:`date=eq.${t}`},({new:e})=>{X().updateEnergyLevel(e.energy_level),X().updateCommunityPulseCount(e.pulse_count_today)}).subscribe(),this._realtimeChannels.pulses=this._sb.channel("collective_pulses_inserts").on("postgres_changes",{event:"INSERT",schema:"public",table:"collective_pulses",filter:`date=eq.${t}`},async({new:e})=>{X().receiveExternalPulse({userId:e.user_id,intensity:.7}),await this.loadRecentSenders()}).subscribe(),this._realtimeChannels.wave=this._sb.channel("wave_contributions_inserts").on("postgres_changes",{event:"INSERT",schema:"public",table:"wave_contributions",filter:`date=eq.${t}`},async({new:e})=>{if(typeof(e==null?void 0:e.minutes)=="number"&&e.minutes>0){const i=X().state.waveTotalMinutes||0;X().updateWaveTotalMinutes(i+e.minutes)}await this.loadWaveParticipants()}).subscribe()},_startPolling(){this._pollInterval&&clearInterval(this._pollInterval),this._pollInterval=setInterval(async()=>{try{await this.loadAll()}catch(t){this._err("poll",t)}},this.POLL_INTERVAL_MS)},destroy(){for(const t of Object.values(this._realtimeChannels))try{t.unsubscribe()}catch{}this._realtimeChannels={},this._pollInterval&&(clearInterval(this._pollInterval),this._pollInterval=null)}};window.addEventListener("pagehide",()=>ge.destroy());window.CollectiveFieldDB=ge;const re={state:{isRendered:!1,calmsSentCount:0,lastCalmSentAt:null,isHolding:!1,holdProgress:0,holdInterval:null,HOLD_DURATION_MS:3e3,COOLDOWN_MS:3e4,energyLevel:42,ENERGY_PER_PULSE:5,isContributing:!1,contributeStartedAt:null,timerInterval:null,countedAsParticipant:!1,waveTotalMinutes:967,WAVE_GOAL_MINUTES:1440,userTodayMinutes:0,userAllTimeMinutes:0,communityPulseCount:47,recentSenders:[]},config:{DEFAULT_PRESENCE_COUNT:127,DEFAULT_WAVE_PARTICIPANTS:0},_FIELD_LABELS:[{min:80,text:"The field is radiant",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="19.78" y1="4.22" x2="17.66" y2="6.34"/><line x1="6.34" y1="17.66" x2="4.22" y2="19.78"/></svg>'},{min:60,text:"The field is strong",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M12 8v8"/></svg>'},{min:40,text:"The field is growing",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6"/><path d="M12 12C12 7 17 4 21 6"/></svg>'},{min:20,text:"The field is flickering",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2L8 10h4l-2 10 8-12h-4l2-6z"/></svg>'},{min:0,text:"The field needs energy",svg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'}],render(){const t=document.getElementById("collectiveFieldContainer");if(!t){console.warn("[CollectiveField] #collectiveFieldContainer not found");return}this._cleanup();try{t.innerHTML=this._buildHTML(),this.state.isRendered=!0,["pulseBtn","waveBtn"].forEach(e=>{const i=document.getElementById(e);i&&(i.addEventListener("contextmenu",o=>o.preventDefault()),i.addEventListener("touchstart",o=>{o.preventDefault(),re.handleHoldStart()},{passive:!1}))}),this._lastSentRefreshInterval=setInterval(()=>{const e=document.getElementById("lastSentLabel");e&&(e.textContent=this._getLastSentLabel())},6e4),this.state.isContributing&&this._resumeWaveTick()}catch(e){console.error("[CollectiveField] render error:",e)}},_buildHTML(){return`
            <div class="section-header">
                <div class="section-title">Collective Field</div>
            </div>
            <div class="collective-grid">
                ${this._buildEnergyFieldHTML()}
                ${this._buildCalmWaveHTML()}
            </div>`},_buildEnergyFieldHTML(){const{energyLevel:t,communityPulseCount:e}=this.state,i=this._getFieldLabel(t),o=this._getLastSentLabel(),n=this._buildRecentSendersHTML();return`
            <div class="collective-card energy-card">
                <div class="collective-icon">${this._buildEnergyFieldSVG()}</div>
                <div class="collective-title">Community Energy</div>

                <div class="collective-count">
                    <span class="count-number" id="communityPulseCount">${e}</span>
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
                                 style="width:${t}%"
                                 role="progressbar"
                                 aria-valuenow="${t}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats" style="display:flex;align-items:center;">
                        <span class="progress-label">Energy Level</span>
                        <span class="progress-value" id="energyValue">${t}%</span>
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
            </div>`},_buildCalmWaveHTML(){const{waveTotalMinutes:t,WAVE_GOAL_MINUTES:e,userTodayMinutes:i,userAllTimeMinutes:o}=this.state,n=this.config.DEFAULT_WAVE_PARTICIPANTS,r=Math.min(Math.round(t/e*100),100),a=Math.max(e-t,0),s=Math.floor(a/60),l=a%60,d=s>0?`${s}h ${l}m`:`${l}m`;return`
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
            </svg>`},_cleanup(){const t=this.state,e=["holdInterval","timerInterval"];for(const i of e)t[i]&&(clearInterval(t[i]),t[i]=null);this._lastSentRefreshInterval&&(clearInterval(this._lastSentRefreshInterval),this._lastSentRefreshInterval=null),t.isHolding=!1},handleHoldStart(){var i;const t=this.state;if(t.lastCalmSentAt&&Date.now()-t.lastCalmSentAt<t.COOLDOWN_MS){const o=Math.ceil((t.COOLDOWN_MS-(Date.now()-t.lastCalmSentAt))/1e3);this._toast(`Wait ${o}s before sending again`);return}if(t.isHolding)return;t.isHolding=!0,t.holdProgress=0,(i=document.getElementById("pulseBtn"))==null||i.classList.add("holding");const e=Date.now();t.holdInterval=setInterval(()=>{const o=Date.now()-e;t.holdProgress=Math.min(o/t.HOLD_DURATION_MS*100,100);const n=document.getElementById("holdRing");n&&(n.style.strokeDashoffset=100.5-t.holdProgress/100*100.5),t.holdProgress>=100&&(clearInterval(t.holdInterval),t.holdInterval=null,t.isHolding=!1,this._firePulse())},50)},handleHoldEnd(){this.state.isHolding&&this._cancelHold()},handleHoldCancel(){this.state.isHolding&&this._cancelHold()},_cancelHold(){var i;const t=this.state;t.holdInterval&&(clearInterval(t.holdInterval),t.holdInterval=null),t.isHolding=!1,t.holdProgress=0,(i=document.getElementById("pulseBtn"))==null||i.classList.remove("holding");const e=document.getElementById("holdRing");e&&(e.style.strokeDashoffset="100.5")},_firePulse(){const t=this.state;t.lastCalmSentAt=Date.now(),t.calmsSentCount++;const e=document.getElementById("pulseBtn");e&&(e.classList.remove("holding"),e.classList.add("fired"),setTimeout(()=>e.classList.remove("fired"),1e3));const i=document.getElementById("holdRing");i&&(i.style.strokeDashoffset="100.5"),this._addEnergy(t.ENERGY_PER_PULSE),this._triggerFieldRipple(t.calmsSentCount),this._triggerAppWideRipple(),this._broadcastPulse(t.calmsSentCount),t.communityPulseCount++,this._addSelfToRecentSenders(),this._refreshEnergyCardMeta(),this._toast("Energy sent")},_addEnergy(t){const e=this.state;e.energyLevel=Math.min(e.energyLevel+t,100),this._updateEnergyBar(e.energyLevel)},_updateEnergyBar(t){var n,r,a;const e=document.getElementById("pulseFill"),i=document.getElementById("energyValue");e&&(e.style.width=`${t}%`,e.setAttribute("aria-valuenow",t)),i&&(i.textContent=`${t}%`);const o=document.getElementById("adminEnergyBtn");o&&(o.style.display=(a=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)!=null&&a.is_admin?"inline":"none")},handleContributeWave(){this.state.isContributing?this._endWave().catch(t=>console.error("[CollectiveField] _endWave error:",t)):this._startWave()},_startWave(){var i;const t=this.state;t.isContributing=!0,t.contributeStartedAt=Date.now(),t.countedAsParticipant=!1,(i=document.getElementById("waveBtn"))==null||i.classList.add("in-progress");const e=document.getElementById("waveBtnLabel");e&&(e.textContent="End Session"),this._updateWaveStatusLine(),this._toast("Silence started"),t.timerInterval=setInterval(()=>this._waveTick(),1e3)},_resumeWaveTick(){var i;const t=this.state;(i=document.getElementById("waveBtn"))==null||i.classList.add("in-progress");const e=document.getElementById("waveBtnLabel");e&&(e.textContent="End Session"),this._updateWaveStatusLine(),t.timerInterval=setInterval(()=>this._waveTick(),1e3)},_waveTick(){const t=this.state;if(!t.isContributing)return;const e=Date.now()-t.contributeStartedAt;!t.countedAsParticipant&&e>=300*1e3&&(t.countedAsParticipant=!0,this._incrementParticipantCount(),this._triggerAvatarRipple(),this._toast("You're in the wave")),this._updateWaveStatusLine(e)},async _endWave(){var s;const t=this.state;clearInterval(t.timerInterval),t.timerInterval=null,t.isContributing=!1;const e=Date.now()-t.contributeStartedAt,i=Math.floor(e/6e4);t.countedAsParticipant&&(this._decrementParticipantCount(),t.countedAsParticipant=!1),(s=document.getElementById("waveBtn"))==null||s.classList.remove("in-progress");const o=document.getElementById("waveBtnLabel");if(o&&(o.textContent="Start Silence"),i<1){this._toast("Sit a little longer"),this._updateWaveStatusLine();return}const n=t.waveTotalMinutes,r=t.userTodayMinutes,a=t.userAllTimeMinutes;t.waveTotalMinutes=Math.min(t.waveTotalMinutes+i,t.WAVE_GOAL_MINUTES),t.userTodayMinutes+=i,t.userAllTimeMinutes+=i,this._updateWaveProgress(),this._updateWaveStatusLine(),this._toast(`${i}min contributed to the wave`),t.waveTotalMinutes>=t.WAVE_GOAL_MINUTES&&this._onWaveComplete();try{await ge.logWaveContribution(i,!0)}catch(l){console.error("[CollectiveField] logWaveContribution failed — rolling back:",l),t.waveTotalMinutes=n,t.userTodayMinutes=r,t.userAllTimeMinutes=a,this._updateWaveProgress(),this._updateWaveStatusLine(),this._toast("Could not save session — please try again")}},_onWaveComplete(){this._toast("The wave is complete! A new one begins tomorrow.")},_updateWaveProgress(){var r,a,s;const t=this.state,e=Math.min(Math.round(t.waveTotalMinutes/t.WAVE_GOAL_MINUTES*100),100),i=document.getElementById("waveFill"),o=document.getElementById("waveProgressValue");i&&(i.style.width=`${e}%`,i.setAttribute("aria-valuenow",e)),o&&(o.textContent=`${e}%`);const n=document.getElementById("adminWaveBtn");n&&(n.style.display=(s=(a=(r=window.Core)==null?void 0:r.state)==null?void 0:a.currentUser)!=null&&s.is_admin?"inline":"none")},_updateWaveStatusLine(t){const e=this.state,i=document.getElementById("waveSessionClock"),o=document.getElementById("waveCountUp"),n=document.getElementById("waveCollectiveTime"),r=document.getElementById("waveClockDisplay"),a=document.getElementById("waveContribBlock");if(!r)return;const s=Math.max(e.WAVE_GOAL_MINUTES-e.waveTotalMinutes,0),l=Math.floor(s/60),d=s%60;if(r.textContent=l>0?`${l}h ${d}m`:`${d}m`,t!==void 0&&e.isContributing){const c=Math.floor(t/6e4),p=Math.floor(t%6e4/1e3);o&&(o.textContent=`${String(c).padStart(2,"0")}:${String(p).padStart(2,"0")}`),i&&(i.style.maxHeight="60px",i.style.opacity="1",i.style.marginBottom="8px"),n&&(n.style.fontSize="13px",n.style.opacity="0.45",n.style.marginTop="2px"),a&&(a.style.opacity="0.5")}else{i&&(i.style.maxHeight="0",i.style.opacity="0",i.style.marginBottom="0"),n&&(n.style.fontSize="",n.style.opacity="1",n.style.marginTop=""),a&&(a.style.opacity="1");const c=document.getElementById("userTodayDisplay"),p=document.getElementById("userAllTimeDisplay");c&&(c.textContent=`${e.userTodayMinutes}m`),p&&(p.textContent=`${e.userAllTimeMinutes}m`)}},_triggerFieldRipple(t){const e=document.querySelector(".energy-card svg");if(!e)return;const i=Math.max(1-(t-1)*.2,.2),o=document.createElementNS("http://www.w3.org/2000/svg","circle");Object.entries({cx:"50",cy:"50",r:"10",fill:"none",stroke:"currentColor","stroke-width":"2"}).forEach(([n,r])=>o.setAttribute(n,r)),o.style.cssText=`opacity:${i};transition:r 1s ease-out,opacity 1s ease-out;`,e.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>{o.style.opacity="0",o.setAttribute("r","48")})),setTimeout(()=>o.remove(),1100)},_triggerAppWideRipple(){if(!document.getElementById("appRippleStyles")){const a=document.createElement("style");a.id="appRippleStyles",a.textContent=`
                @keyframes waterRipple  { 0%{width:0;height:0;opacity:0.8;box-shadow:0 0 0 0 rgba(90,180,160,0.3)} 30%{opacity:0.6;box-shadow:0 0 24px 8px rgba(90,180,160,0.15)} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0;box-shadow:0 0 0 0 rgba(90,180,160,0)} }
                @keyframes waterRipple2 { 0%{width:0;height:0;opacity:0} 15%{opacity:0.5} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0} }
                @keyframes waterRipple3 { 0%{width:0;height:0;opacity:0} 25%{opacity:0.3} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0} }
                #appRippleOverlay { position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:visible; }
                .app-wide-ripple  { position:absolute;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);will-change:width,height,opacity; }
                .app-wide-ripple.ring-1 { border:4px solid rgba(90,180,160,0.85);background:rgba(90,180,160,0.06);animation:waterRipple  2.6s cubic-bezier(0.1,0.4,0.3,1) forwards; }
                .app-wide-ripple.ring-2 { border:2.5px solid rgba(90,180,160,0.5);background:transparent;animation:waterRipple2 2.6s cubic-bezier(0.1,0.4,0.3,1) 0.3s forwards; }
                .app-wide-ripple.ring-3 { border:1.5px solid rgba(90,180,160,0.3);background:transparent;animation:waterRipple3 2.6s cubic-bezier(0.1,0.4,0.3,1) 0.6s forwards; }
            `,document.head.appendChild(a)}let t=document.getElementById("appRippleOverlay");t||(t=document.createElement("div"),t.id="appRippleOverlay",document.body.appendChild(t));const e=document.querySelector(".energy-card"),i=e?e.getBoundingClientRect():null,o=i?i.left+i.width/2:window.innerWidth/2,n=i?i.top+i.height/2:window.innerHeight/2,r=Math.hypot(window.innerWidth,window.innerHeight)*2.2;["ring-1","ring-2","ring-3"].forEach((a,s)=>{const l=document.createElement("div");l.className=`app-wide-ripple ${a}`,l.style.cssText=`--ripple-size:${r}px;left:${o}px;top:${n}px;`,t.appendChild(l),setTimeout(()=>l.remove(),3400+s*300)})},_triggerAvatarRipple(){var a,s;if(!document.getElementById("waveRippleStyles")){const l=document.createElement("style");l.id="waveRippleStyles",l.textContent=`
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
            `,document.head.appendChild(l)}const t=document.getElementById("waveRippleStage");if(!t)return;const e=(s=(a=window.Core)==null?void 0:a.state)==null?void 0:s.currentUser,i=(e==null?void 0:e.avatar_url)||null,o=(e==null?void 0:e.emoji)||"🧘",n=Math.floor(Math.random()*((t.offsetWidth||80)-36))+2;let r;i?(r=Object.assign(document.createElement("img"),{src:i,alt:"You",className:"wave-avatar-ripple"}),r.onerror=()=>r.replaceWith(this._makeEmojiRipple(o,n))):r=this._makeEmojiRipple(o,n),r.style.left=`${n}px`,t.appendChild(r),setTimeout(()=>r.remove(),3e3)},_makeEmojiRipple(t,e){const i=document.createElement("span");return i.textContent=t,i.className="wave-avatar-ripple",i.style.cssText=`left:${e}px;line-height:28px;text-align:center;`,i},_incrementParticipantCount(){const t=document.getElementById("waveParticipants");t&&(t.textContent=parseInt(t.textContent||"0")+1)},_decrementParticipantCount(){const t=document.getElementById("waveParticipants");t&&(t.textContent=Math.max(parseInt(t.textContent||"0")-1,0))},_broadcastPulse(t){ge==null||ge.recordPulse().catch(e=>console.error("[CollectiveField] recordPulse failed:",e))},receiveExternalPulse(t){const e=Math.min(t.intensity||.6,.8);this._triggerFieldRipple(Math.round((1-e)/.2)+1)},_refreshEnergyCardMeta(){const t=this.state,e=document.getElementById("fieldStateLabel"),i=document.getElementById("lastSentLabel"),o=document.getElementById("communityPulseCount"),n=document.getElementById("recentSendersStrip");e&&(e.innerHTML=this._getFieldLabel(t.energyLevel)),i&&(i.textContent=this._getLastSentLabel()),o&&(o.textContent=t.communityPulseCount),n&&(n.innerHTML=this._buildRecentSendersHTML())},_addSelfToRecentSenders(){var e,i;const t=(i=(e=window.Core)==null?void 0:e.state)==null?void 0:i.currentUser;this.state.recentSenders=[{emoji:(t==null?void 0:t.emoji)||"🧘",avatarUrl:(t==null?void 0:t.avatar_url)||null},...this.state.recentSenders].slice(0,5)},_getFieldLabel(t){const{text:e,svg:i}=this._FIELD_LABELS.find(o=>t>=o.min)||this._FIELD_LABELS.at(-1);return`<span style="display:inline-flex;align-items:center;gap:5px;opacity:0.75;">${i}<span>${e}</span></span>`},_getLastSentLabel(){const t=this.state.lastCalmSentAt;if(!t)return"Not sent yet";const e=Math.floor((Date.now()-t)/1e3);if(e<60)return`Sent ${e}s ago`;const i=Math.floor(e/60);return i<60?`Sent ${i}m ago`:`Sent ${Math.floor(i/60)}h ago`},_buildRecentSendersHTML(){const t=this.state.recentSenders;return t.length?t.slice(0,5).map(e=>e.avatarUrl?`<img src="${e.avatarUrl}" alt="" width="26" height="26" loading="lazy" decoding="async"
                             style="width:26px;height:26px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border-subtle,rgba(0,0,0,0.1));"
                             onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${e.emoji||"🧘"}',style:'font-size:20px;line-height:26px;'}))">`:`<span style="font-size:20px;line-height:26px;" title="Recent sender">${e.emoji||"🧘"}</span>`).join(""):'<span style="font-size:11px;color:var(--text-muted);font-style:italic;">No one yet - be first</span>'},updatePresenceCount(t){if(typeof t!="number"||t<0)return;const e=document.getElementById("presenceCount");e&&(e.textContent=t)},updateEnergyLevel(t){typeof t!="number"||t<0||t>100||(this.state.energyLevel=t,this._updateEnergyBar(t))},updateCommunityPulseCount(t){this.state.communityPulseCount=t||0;const e=document.getElementById("communityPulseCount");e&&(e.textContent=this.state.communityPulseCount)},updateRecentSenders(t){this.state.recentSenders=t||[];const e=document.getElementById("recentSendersStrip");e&&(e.innerHTML=this._buildRecentSendersHTML())},updateUserContribution(t,e){this.state.userTodayMinutes=t||0,this.state.userAllTimeMinutes=e||0,this.state.isContributing||this._updateWaveStatusLine()},updateWaveParticipants(t){this.config.DEFAULT_WAVE_PARTICIPANTS=t||0;const e=document.getElementById("waveParticipants");e&&(e.textContent=t||0)},updateWaveTotalMinutes(t){typeof t!="number"||t<0||(this.state.waveTotalMinutes=Math.min(t,this.state.WAVE_GOAL_MINUTES),this._updateWaveProgress(),this.state.isContributing||this._updateWaveStatusLine())},refresh(){try{this.render()}catch(t){console.error("[CollectiveField] refresh error:",t)}},injectAdminUI(){var o,n,r;const t=(r=(n=(o=window.Core)==null?void 0:o.state)==null?void 0:n.currentUser)==null?void 0:r.is_admin,e=document.getElementById("adminEnergyBtn"),i=document.getElementById("adminWaveBtn");e&&(e.style.display=t?"inline":"none"),i&&(i.style.display=t?"inline":"none")},async adminAddEnergy(){var t,e,i;if((i=(e=(t=window.Core)==null?void 0:t.state)==null?void 0:e.currentUser)!=null&&i.is_admin)try{const o=window.AppSupabase||window.CommunitySupabase;if(!o)throw new TypeError("Supabase client unavailable");const{error:n}=await o.rpc("increment_field_pulse",{p_date:new Date().toISOString().slice(0,10),p_energy_add:10});if(n)throw n;await window.CollectiveFieldDB.loadFieldState(),this._toast("+10 Energy added")}catch(o){console.error("[CollectiveField] adminAddEnergy error:",o),this._toast("Could not add energy")}},async adminAddWaveMinutes(){var t,e,i;if((i=(e=(t=window.Core)==null?void 0:t.state)==null?void 0:e.currentUser)!=null&&i.is_admin)try{await window.CollectiveFieldDB.logWaveContribution(60,!1),this._toast("+60 min added to Wave")}catch(o){console.error("[CollectiveField] adminAddWaveMinutes error:",o),this._toast("Could not add wave minutes")}},_toast(t){var e;(e=window.Core)==null||e.showToast(t)}};window.addEventListener("beforeunload",()=>re._cleanup());window.CollectiveField=re;const _e='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.8;"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',We='<span style="background:rgba(239,68,68,0.85);color:white;font-size:11px;font-weight:700;letter-spacing:0.08em;padding:4px 10px;border-radius:4px;text-transform:uppercase;">In Session</span>',ke={MAX:5,fallbackGradient:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};function ne(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const ce={bless:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.8;"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',leave:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',book:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',alert:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',block:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',mute:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',help:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>'},Ae={data:null,fetchedAt:0,TTL_MS:12e4,async get(){const t=Date.now();if(this.data&&t-this.fetchedAt<this.TTL_MS)return this.data;try{this.data=await u.getBlockedUsers(),this.fetchedAt=t}catch{this.data=this.data??new Set}return this.data},invalidate(){this.data=null,this.fetchedAt=0}};let L=class fe{constructor(e){this.roomId=e.roomId,this.roomType=e.roomType,this.config={name:"Practice Room",icon:"🧘",description:"A space for practice",energy:"Peaceful",statusRingColor:"var(--neuro-accent)",imageUrl:"",...e},this.state={participants:e.participants||0,isActive:!0,...e.state},this.eventListeners=[]}_dbReady(){return!!(u!=null&&u.ready)}init(){var e;this.updateRoomCard(),window[`${this.roomId}_blessRoom`]=()=>this._blessRoom(),window[`${this.roomId}_showScheduleModal`]=()=>{var i;return(i=this.showScheduleModal)==null?void 0:i.call(this)},window[`${this.roomId}_closeScheduleModal`]=()=>{var i;return(i=this.closeScheduleModal)==null?void 0:i.call(this)},this.mountHubModals(),this._loadBlessingCount(),(e=this.onInit)==null||e.call(this)}mountHubModals(){var n,r;const e=((n=this.buildHubModals)==null?void 0:n.call(this))||"";if(!e)return;let i=document.getElementById("roomHubModals");i||(i=Object.assign(document.createElement("div"),{id:"roomHubModals"}),i.style.cssText="position:relative;z-index:200000;",document.body.appendChild(i)),(r=document.getElementById(`${this.roomId}HubModalsSlot`))==null||r.remove();const o=Object.assign(document.createElement("div"),{id:`${this.roomId}HubModalsSlot`,innerHTML:e});i.appendChild(o)}buildHubModals(){return""}enterRoom(){var e;if(!this.canEnterRoom()){window.Core.showToast("Session in progress. Please wait for the next opening.");return}fe.stopHubPresence(),this.createPracticeView(),window.Core.navigateTo("practiceRoomView"),window.Core.showToast(`${this.config.icon} Entered ${this.config.name}`),this.setupEventListeners(),(e=this.onEnter)==null||e.call(this),this._setRoomPresence(this.roomId),re&&!re.state.isContributing&&re._startWave(),setTimeout(async()=>{await this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`)},300),setTimeout(()=>{this._refreshBlessingCounter(),this._subscribeToBlessings()},400),u.logRoomEntry(this.roomId).then(i=>{this._roomEntryId=i}).catch(()=>{})}leaveRoom(){var e;this._exitCleanup(),window.Core.navigateTo("hubView"),window.Core.showToast(`Left ${this.config.name}`),(e=this.onLeave)==null||e.call(this),fe.startHubPresence()}gentlyLeave(){var e;this._exitCleanup(),(e=this.onLeave)==null||e.call(this),fe.startHubPresence(),window.Rituals?Rituals.showClosing():window.Core.navigateTo("hubView")}_exitCleanup(){re!=null&&re.state.isContributing&&re._endWave(),this._clearRoomPresence(),Ae.invalidate(),this._lastParticipantKey=null,this._participantFetchInFlight=!1,this._blessingRows=null,clearTimeout(this._blessingRefreshTimer),this._roomEntryId&&(u.logRoomExit(this._roomEntryId).catch(()=>{}),this._roomEntryId=null);for(const e of["_presenceSub","_sidebarPresenceSub"])if(this[e]){try{this[e].unsubscribe()}catch{}this[e]=null}u&&u.unsubscribeFromBlessings(this.roomId),this.cleanup()}canEnterRoom(){return!0}_isWithinOpenWindow(){return this.roomType!=="timed"?!0:typeof this._checkCycleWindow=="function"?this._checkCycleWindow():!0}cleanup(){var e;this.eventListeners.forEach(({element:i,event:o,handler:n})=>i.removeEventListener(o,n)),this.eventListeners=[],(e=this.onCleanup)==null||e.call(this)}_setRoomPresence(e){var i;if(this._dbReady())try{const o=fe.ROOM_ACTIVITIES[e]??`${this.config.icon} ${this.config.name}`;u.setPresence("online",o,e),(i=window.Core)!=null&&i.state&&(window.Core.state.currentRoom=e,window.Core.state.currentUser&&(window.Core.state.currentUser.activity=o))}catch(o){console.error("[PracticeRoom] _setRoomPresence error:",o)}}_clearRoomPresence(){var e;if(this._dbReady())try{u.setPresence("online","✨ Available",null),(e=window.Core)!=null&&e.state&&(window.Core.state.currentRoom=null,window.Core.state.currentUser&&(window.Core.state.currentUser.activity="✨ Available"))}catch(i){console.error("[PracticeRoom] _clearRoomPresence error:",i)}}async fetchRoomParticipants(){if(this._dbReady())try{const[e,i]=await Promise.all([u.getRoomParticipants(this.roomId),Ae.get()]),o=e.filter(n=>!i.has(n.user_id));this.state.participants=o.length,this._updateParticipantUI(o),this._updateRoomCardCount(o.length)}catch(e){console.error(`[${this.roomId}] fetchRoomParticipants error:`,e)}}_updateParticipantUI(e){const i=document.getElementById(`${this.roomId}ParticipantCount`);i&&(i.textContent=this.getParticipantText());const o=document.getElementById(`${this.roomId}ParticipantStack`);o&&(o.innerHTML=this._buildAvatarStack(e))}async _refreshParticipantSidebar(e,i=null){var n;if(!this._dbReady())return;const o=async()=>{if(this._participantFetchInFlight)return;this._participantFetchInFlight=!0;const[r,a]=await Promise.all([u.getRoomParticipants(this.roomId),Ae.get()]),s=r.filter(c=>!a.has(c.user_id));this._participantFetchInFlight=!1;const l=s.map(c=>c.user_id).sort().join(",");if(l===this._lastParticipantKey)return;this._lastParticipantKey=l,this.state.participants=s.length,this._updateParticipantUI(s);const d=document.getElementById(e);if(d&&this._renderParticipantList(d,s),i){const c=document.getElementById(i);c&&(c.textContent=`${s.length} present`)}this._updateRoomCardCount(s.length)};try{await o()}catch(r){this._participantFetchInFlight=!1,console.error(`[${this.roomId}] _refreshParticipantSidebar error:`,r);return}(n=this._sidebarPresenceSub)==null||n.unsubscribe(),this._sidebarPresenceSub=u.subscribeToPresence(async()=>{var r;document.getElementById(e)?await o():((r=this._sidebarPresenceSub)==null||r.unsubscribe(),this._sidebarPresenceSub=null)})}_updateRoomCardCount(e){this.state.participants=e;const i=document.querySelector(`[data-room-id="${this.roomId}"] .room-participants`);i&&(i.textContent=this.getParticipantText())}_buildAvatarStack(e,i=22,o=9){const{MAX:n,fallbackGradient:r}=ke,a=e.slice(0,n),s=e.length-n,l=a.map(c=>{var _,k;const p=c.profiles||{},h=ne(p.name||"Member"),m=ne(p.avatar_url||""),f=ne(p.emoji||"")||h.charAt(0).toUpperCase(),b=((k=(_=window.Core)==null?void 0:_.getAvatarGradient)==null?void 0:k.call(_,c.user_id||h))??r,M=m?`<img src="${m}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${h}" loading="lazy" decoding="async">`:`<span style="color:white;font-size:${o}px;font-weight:700;">${f}</span>`;return`<div title="${h}" style="width:${i}px;height:${i}px;border-radius:50%;background:${m?"transparent":b};border:2px solid var(--surface);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-left:-6px;flex-shrink:0;">${M}</div>`}).join(""),d=s>0?`<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${s}</span>`:"";return l+d}_buildRealAvatars(e){const{MAX:i,fallbackGradient:o}=ke,n=e.slice(0,i),r=e.length-i;return n.map(s=>{var A,j;const l=s.profiles||{},d=s.user_id||l.id||"",c=ne(l.name||"Member"),p=ne(l.avatar_url||""),h=ne(l.emoji||""),m=((j=(A=window.Core)==null?void 0:A.getAvatarGradient)==null?void 0:j.call(A,d||c))??o,g=p?`<img src="${p}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${c}" loading="lazy" decoding="async">`:`<span aria-hidden="true">${h||c.charAt(0).toUpperCase()}</span>`,f=p?"background:transparent;":`background:${m};`,b=d?`onclick="openMemberProfileAboveRoom('${d}')"`:"",M=d?"button":"img",C=d?'tabindex="0"':"",_=d?`onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${d}');}"`:"",k=`aria-label="${c}"`;return`<div class="p-avatar" style="${f}" title="${c}" role="${M}" ${C} ${k} ${b} ${_}>${g}</div>`}).join("")+(r>0?`<div class="p-avatar" style="background:var(--surface);color:var(--text-muted);font-size:11px;">+${r}</div>`:"")}_renderParticipantList(e,i){if(!i.length){e.innerHTML='<div style="color:var(--text-muted);font-size:13px;padding:8px;">Just you here 🕯️</div>';return}const{fallbackGradient:o}=ke;e.innerHTML=i.map(n=>{var b,M;const r=n.profiles||{},a=n.user_id||r.id||"",s=ne(r.name||"Member"),l=ne(r.avatar_url||""),d=ne(r.emoji||""),c=((M=(b=window.Core)==null?void 0:b.getAvatarGradient)==null?void 0:M.call(b,a||s))??o,p=l?`<img src="${l}" referrerpolicy="no-referrer" width="40" height="40" style="width:40px;height:40px;min-width:40px;min-height:40px;object-fit:cover;border-radius:50%;display:block;" alt="${s}" loading="lazy" decoding="async">`:`<span style="color:white;font-weight:600;font-size:13px;">${d||s.charAt(0).toUpperCase()}</span>`,h=l?"background:transparent;":`background:${c};`,m=a?`onclick="openMemberProfileAboveRoom('${a}')"`:"",g=a?`onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${a}');}"`:"";return`
            <div class="campfire-participant" ${m} ${g} ${a?'role="button" tabindex="0"':""} style="${a?"cursor:pointer;":""}">
                <div class="campfire-participant-avatar" style="${h}width:40px;height:40px;min-width:40px;min-height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;">${p}</div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name">${s}</div>
                    <div class="campfire-participant-country">${ne(n.activity||"✨ Available")}</div>
                </div>
            </div>`}).join("")}async _blessRoom(){var s;const e=document.getElementById(`${this.roomId}BlessBtn`);if(!this._dbReady()){window.Core.showToast("Blessing sent ✨"),this._showBlessingAnimation(null);return}const i=Date.now(),o=this._lastBlessedAt??0,n=6e4;if(i-o<n){const l=Math.ceil((n-(i-o))/1e3);window.Core.showToast(`✦ Room is holding your blessing — try again in ${l}s`);return}if(e){if(e.dataset.blessed)return;e.dataset.blessed="1",e.style.opacity="0.7",e.innerHTML=`${_e} Blessed ✦`,setTimeout(()=>{delete e.dataset.blessed,e.style.opacity="1";const l='<div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>';e.innerHTML=`${l} ${_e} Bless this room ${l}`},3e3)}this._lastBlessedAt=i,this._showBlessingAnimation(null),window.Core.showToast("Blessing sent ✨");const r=await u.blessRoom(this.roomId);if(r.status==="cooldown"){window.Core.showToast("✦ This room is still holding your last blessing"),this._lastBlessedAt=i;return}if(r.status==="error")return;this._blessingRows=this._blessingRows??[];const a=u.userId;if(a&&!this._blessingRows.some(l=>(l.user_id||l.userId)===a)){const l=((s=r.data)==null?void 0:s.profiles)??null;this._blessingRows=[...this._blessingRows,{user_id:a,profiles:l}]}this._updateCardBlessingBadge(this._blessingRows.length),this._refreshBlessingCounter()}async _loadBlessingCount(){if(this._dbReady())try{const e=await u.getRoomBlessings(this.roomId);this._blessingRows=e,this._updateCardBlessingBadge(e.length)}catch{}}_updateCardBlessingBadge(e){const i=document.getElementById(`${this.roomId}BlessBtn`);if(!i)return;const o='<div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>';i.style.color="#fff",i.innerHTML=`${o} ${_e} Bless this room ${o}`}_subscribeToBlessings(){this._dbReady()&&u.subscribeToBlessings(this.roomId,e=>{this._showBlessingAnimation(e),this._optimisticBlessingBump(e),this._debouncedRefreshBlessingCounter()})}_optimisticBlessingBump(e){this._blessingRows=this._blessingRows??[];const i=(e==null?void 0:e.userId)||(e==null?void 0:e.user_id);i&&!this._blessingRows.some(o=>(o.user_id||o.userId)===i)&&(this._blessingRows=[...this._blessingRows,e]),this._renderBlessingCounter(this._blessingRows),this._updateCardBlessingBadge(this._blessingRows.length)}_debouncedRefreshBlessingCounter(){clearTimeout(this._blessingRefreshTimer),this._blessingRefreshTimer=setTimeout(()=>this._refreshBlessingCounter(),3e3)}async _refreshBlessingCounter(){if(this._dbReady())try{const e=await u.getRoomBlessings(this.roomId);this._blessingRows=e,this._renderBlessingCounter(e),this._updateCardBlessingBadge(e.length)}catch{}}_normaliseBlessingRow(e){return e.profiles?e:{user_id:e.userId||e.user_id,profiles:{name:e.name||"A member",avatar_url:e.avatarUrl||"",emoji:e.emoji||""}}}_renderBlessingCounter(e){const i=document.getElementById(`${this.roomId}BlessedCounter`);if(!i)return;if(!e.length){i.innerHTML='<span style="font-size:12px;color:var(--text-muted);opacity:0.6;">No blessings yet</span>';return}const o=e.map(s=>this._normaliseBlessingRow(s)),n=this._buildAvatarStack(o),r=Math.max(0,e.length-ke.MAX),a=r>0?`<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${r}</span>`:"";i.innerHTML=`
            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;margin-right:4px;display:inline-flex;align-items:center;gap:0.25rem;">${ce.bless} Blessed by</span>
            <div style="display:flex;align-items:center;margin-left:6px;">${n}</div>
            ${a}`}_showBlessingAnimation(e){if(document.getElementById("blessingAnimationOverlay"))return;const i=3e3,o=window.innerWidth<768,n=window.innerWidth,r=window.innerHeight,a=n/2,s=r/2,l=document.createElement("div");l.id="blessingAnimationOverlay",l.style.cssText=["position:fixed;inset:0;pointer-events:none;z-index:999999;","backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);","background:rgba(0,0,0,0);","transition:background 0.2s ease;"].join(""),document.body.appendChild(l),requestAnimationFrame(()=>{l.style.background="rgba(0,0,0,0.25)"});const d=document.createElement("canvas");d.width=n,d.height=r,d.style.cssText="position:absolute;inset:0;width:100%;height:100%;background:transparent;",l.appendChild(d);const c=d.getContext("2d"),p=document.createElement("div");p.style.cssText=["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.6);","color:rgba(255,230,120,0.95);font-size:clamp(36px,8vw,72px);font-weight:300;","letter-spacing:0.25em;text-transform:uppercase;white-space:nowrap;","font-family:var(--serif,Georgia,serif);","text-shadow:0 0 40px rgba(255,200,60,0.8),0 0 80px rgba(255,180,40,0.4);","opacity:0;transition:opacity 0.35s ease,transform 0.5s cubic-bezier(0.34,1.56,0.64,1);","pointer-events:none;"].join(""),p.textContent="✦  Blessed  ✦",l.appendChild(p),setTimeout(()=>{p.style.opacity="1",p.style.transform="translate(-50%,-50%) scale(1)"},i*.42),setTimeout(()=>{p.style.opacity="0",p.style.transform="translate(-50%,-50%) scale(1.15)",p.style.transition="opacity 0.4s ease,transform 0.4s ease"},i-600);const h=(e==null?void 0:e.name)??null;if(h){const C=document.createElement("div");C.style.cssText=["position:absolute;bottom:18%;left:50%;transform:translateX(-50%);","color:rgba(255,230,160,0.9);font-size:15px;font-weight:400;","letter-spacing:0.18em;text-transform:uppercase;white-space:nowrap;","font-family:var(--serif,Georgia,serif);","opacity:0;transition:opacity 0.6s ease 0.6s;"].join(""),C.textContent=`✦  ${h} blesses this room  ✦`,l.appendChild(C),requestAnimationFrame(()=>{C.style.opacity="1"}),setTimeout(()=>{C.style.opacity="0",C.style.transition="opacity 0.4s ease"},i-500)}const m=o?120:260,g=[];for(let C=0;C<m;C++){const _=Math.random()*Math.PI*2,k=20+Math.random()*Math.max(n,r)*.55,A=Math.random()<.75,j=A?38+Math.random()*18:265+Math.random()*25,T=A?85+Math.random()*15:70+Math.random()*20,P=60+Math.random()*25;g.push({angle:_,radius:k,x:a+Math.cos(_)*k,y:s+Math.sin(_)*k,size:1+Math.random()*(o?2:3),hue:j,sat:T,lit:P,delay:Math.random()*.3,speed:.8+Math.random()})}const f=performance.now();let b;const M=C=>{const _=(C-f)/i,k=.42,A=.48,j=1;if(c.globalCompositeOperation="destination-out",c.globalAlpha=.18,c.fillStyle="rgba(0,0,0,1)",c.fillRect(0,0,n,r),c.globalCompositeOperation="source-over",c.globalAlpha=1,_>k*.6&&_<j*.85){const T=_<A?(_-k*.6)/(A-k*.6):1-(_-A)/(j-A),P=Math.max(0,Math.min(1,T)),U=80+T*120,B=c.createRadialGradient(a,s,0,a,s,U);B.addColorStop(0,`rgba(255,220,100,${.55*P})`),B.addColorStop(.5,`rgba(200,150, 60,${.25*P})`),B.addColorStop(1,"rgba(200,150, 60,0)"),c.globalAlpha=1,c.fillStyle=B,c.beginPath(),c.arc(a,s,U,0,Math.PI*2),c.fill()}g.forEach(T=>{const P=Math.max(0,_-T.delay*.3);let U,B,W;if(P<k){const O=P/k,V=1-(1-O)*(1-O),$=T.radius*(1-V*.97),S=V*Math.PI*2.5*(T.radius>0?1:-1);U=a+Math.cos(T.angle+S)*$,B=s+Math.sin(T.angle+S)*$,W=Math.min(1,V*2.5)}else if(P<A)U=a+(Math.random()-.5)*8,B=s+(Math.random()-.5)*8,W=1;else{const O=(P-A)/(j-A),V=O*O,$=T.angle+Math.PI*(.7+Math.random()*.6),S=V*Math.max(n,r)*.7*T.speed;U=a+Math.cos($)*S,B=s+Math.sin($)*S,W=Math.max(0,1-O*1.15)}W<=0||(c.globalAlpha=W,c.fillStyle=`hsl(${T.hue},${T.sat}%,${T.lit}%)`,c.shadowBlur=o?4:8,c.shadowColor=`hsl(${T.hue},100%,70%)`,c.beginPath(),c.arc(U,B,T.size,0,Math.PI*2),c.fill())}),c.globalAlpha=1,c.shadowBlur=0,_<1?b=requestAnimationFrame(M):(l.style.transition="opacity 0.3s ease",l.style.opacity="0",setTimeout(()=>l.remove(),350),cancelAnimationFrame(b))};b=requestAnimationFrame(M)}createPracticeView(){var o;const e=[this.buildHeader(),this.buildBody(),this.buildInstructionsModal(),((o=this.buildAdditionalModals)==null?void 0:o.call(this))??""].join("");N.injectModals();const i=document.getElementById("dynamicRoomContent");if(i)i.innerHTML=e;else{if(document.getElementById(`${this.roomId}View`))return;document.body.insertAdjacentHTML("beforeend",`<div class="view practice-space" id="${this.roomId}View">${e}</div>`)}}buildHeader(){var e;return`
        <header class="ps-header" style="padding:12px 16px;display:flex;flex-direction:column;gap:12px;${this.getHeaderGradient()}">
            <div class="ps-info" style="display:flex;flex-direction:column;align-items:flex-start;min-width:0;">
                <div style="width:100%;display:flex;justify-content:flex-start;">
                    <img src="${this.config.imageUrl}" alt="${this.config.name}" width="600" height="400" loading="lazy" decoding="async" style="max-width:600px;width:100%;height:auto;display:block;">
                </div>
                <div style="display:flex;align-items:center;gap:20px;margin-top:16px;flex-wrap:wrap;">
                    <div class="ps-participants" style="display:flex;align-items:center;gap:8px;">
                        ${this.buildParticipantAvatars()}
                        <span id="${this.roomId}ParticipantCount" style="font-size:14px;font-weight:500;letter-spacing:0.05em;">${this.getParticipantText()}</span>
                    </div>
                    <div id="${this.roomId}BlessedCounter" style="display:flex;align-items:center;gap:4px;opacity:0.85;">
                        <span style="font-size:12px;color:var(--text-muted);">Loading blessings…</span>
                    </div>
                </div>
            </div>
            <div class="ps-header-btn-grid">
                ${((e=this.buildAdditionalHeaderButtons)==null?void 0:e.call(this))??""}
                ${this.buildSafetyDropdown()}
                <button type="button" class="ps-leave ps-header-btn" data-action="gentlyLeave">
                    ${ce.leave} Gently Leave
                </button>
            </div>
        </header>`}buildSafetyDropdown(){const e=[["CommunityModule.showReportModal()",ce.alert,"Report Issue"],["CommunityModule.showBlockModal()",ce.block,"Block User"],["CommunityModule.muteChat()",ce.mute,"Mute Chat"],["CommunityModule.showHelpModal()",ce.help,"Get Help"]];return`
        <div style="position:relative;" id="${this.roomId}SafetyDropdownContainer">
            <button type="button" class="ps-leave" data-action="toggleSafety"
                    aria-haspopup="true" aria-expanded="false"
                    style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);white-space:nowrap;padding:10px 16px;">
                ${ce.shield} Safety <span style="font-size:12px;">▼</span>
            </button>
            <div id="${this.roomId}SafetyDropdown"
                 style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);min-width:200px;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:100001;">
                <button type="button" data-action="showInstructions"
                        style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text);">
                    <span aria-hidden="true">${ce.book}</span> Instructions
                </button>
                ${e.map(([i,o,n],r,a)=>{const s=r<a.length-1?"border-bottom:1px solid var(--border);":"";return`<button type="button" onclick="${i}" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;${s}cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text);"><span aria-hidden="true">${o}</span> ${n}</button>`}).join("")}
            </div>
        </div>`}buildParticipantAvatars(){const[e,i]=this.config.name.split(" ").map(o=>o[0]);return`
        <div class="participant-stack" id="${this.roomId}ParticipantStack">
            <div class="p-avatar" style="background:linear-gradient(135deg,#f093fb,#f5576c);" aria-hidden="true">${e||"P"}</div>
            <div class="p-avatar" style="background:linear-gradient(135deg,#4facfe,#00f2fe);" aria-hidden="true">${i||"R"}</div>
        </div>`}buildBody(){return'<div class="ps-body"><main class="ps-main"><p>Override buildBody() in your room class.</p></main></div>'}buildInstructionsModal(){return`
        <div class="modal-overlay" id="${this.roomId}InstructionsModal">
            <div class="modal-card">
                <button type="button" class="modal-close" aria-label="Close modal" data-action="closeInstructions">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> ${this.config.name}</h2>
                    ${this.getInstructions()}
                    <button type="button" data-action="closeInstructions" style="width:100%;padding:12px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;margin-top:16px;">Close</button>
                </div>
            </div>
        </div>`}getInstructions(){return`
            <p><strong>Welcome to ${this.config.name}.</strong></p>
            <h3>How to Practice:</h3>
            <ul>
                <li>Find a comfortable space</li>
                <li>Focus on your intention</li>
                <li>Practice with presence</li>
            </ul>`}buildParticipantSidebarHTML(e,i,o,n="400px"){return`
        <div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:6px 8px;background:var(--background);">
            <div style="font-weight:600;font-size:13px;margin-bottom:2px;text-align:center;">${e}</div>
            <div id="${o}" style="font-size:11px;color:var(--text-muted);margin-bottom:4px;text-align:center;">${this.state.participants} present</div>
            <div id="${i}" class="campfire-participants" style="height:${n};overflow-y:auto;">
                <div style="color:var(--text-muted);font-size:13px;padding:8px;">Loading...</div>
            </div>
        </div>`}updateRoomCard(){var o;const e=document.querySelector(`[data-room-id="${this.roomId}"]`);if(!e)return;const i=e.querySelector(".room-energy span");if(i&&(i.textContent=this.getParticipantText()),this.roomType==="timed"){const n=this.canEnterRoom(),r=this._isWithinOpenWindow();e.style.cursor=n?"pointer":"not-allowed",e.style.opacity=r?"1":"0.55",e.style.border=`3px solid ${r?"#22c55e":"#ef4444"}`,e.onclick=n?()=>this.enterRoom():null,e.classList.toggle("active",r),e.classList.toggle("in-session",!r);let a=e.querySelector(".in-session-label");!r&&!a?(a=document.createElement("div"),a.className="in-session-label",a.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;",a.innerHTML=We,e.appendChild(a)):r&&a&&a.remove();const s=e.querySelector(".room-timer");s&&this.getTimerText&&(s.innerHTML=this.getTimerText())}else e.style.border="3px solid #22c55e",e.classList.add("active");(o=this.onUpdateCard)==null||o.call(this,e)}getRoomCardHTML(){const e=this.canEnterRoom(),i=this.roomType==="timed",o=!i||this._isWithinOpenWindow(),n=`${this.roomId}_enterRoom`;return window[n]=()=>this.enterRoom(),`
        <div class="practice-room ${o?"active":"in-session"}"
             data-room-type="${this.roomType}"
             data-room-id="${this.roomId}"
             ${e?`onclick="${n}()"`:""}
             style="cursor:${e?"pointer":"not-allowed"};border:3px solid ${o?"#22c55e":"#ef4444"};position:relative;opacity:${o?"1":"0.55"};display:flex;flex-direction:column;">

            ${this.getDevModeBadge()}

            ${!o&&i?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;">${We}</div>`:""}

            <img src="${this.config.imageUrl}" alt="${this.config.name}" width="800" height="450" loading="lazy" decoding="async" style="width:100%;height:auto;display:block;margin-bottom:12px;">

            <div class="room-desc" style="text-align:center;margin-bottom:16px;">${this.config.description}</div>

            <div style="flex:1;">${this.buildCardFooter()}</div>

            <div style="width:100%;padding:16px 24px 0 24px;box-sizing:border-box;">
                <div id="${this.roomId}BlessBtn"
                     role="button" tabindex="0"
                     onclick="event.stopPropagation();${this.roomId}_blessRoom()"
                     onkeydown="if(event.key==='Enter'||event.key===' '){event.stopPropagation();${this.roomId}_blessRoom();}"
                     title="Send a blessing to everyone inside"
                     class="bless-room-btn"
                     style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px 16px;font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#c8a96e,#e8d5a0,#a8824a,#dfc87a);border-radius:20px;cursor:pointer;white-space:nowrap;transition:opacity 0.2s,transform 0.15s;user-select:none;box-shadow:2px 2px 6px rgba(120,80,20,0.25),-1px -1px 4px rgba(255,230,160,0.4);">
                    <div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>
                    ${_e} Bless this room
                    <div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>
                </div>
            </div>
        </div>`}buildCardFooter(){if(this.roomType==="timed"&&this.getTimerText){const e=this.showScheduleModal?`<button type="button" onclick="event.stopPropagation();window['${this.roomId}_showScheduleModal']()" style="background:none;border:none;padding:0;font-size:11px;color:var(--text-muted);cursor:pointer;text-decoration:underline;text-align:left;display:inline-flex;align-items:center;gap:0.3rem;white-space:nowrap;flex-shrink:0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> View Schedule</button>`:"";return`
            <div class="room-participants" style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${this.state.participants} present</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                ${e}
                <div class="room-timer" style="font-size:11px;color:var(--text-muted);text-align:right;line-height:1.4;margin-left:auto;">${this.getTimerText()}</div>
            </div>`}return`
        <div style="text-align:left;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
        </div>`}setupEventListeners(){setTimeout(()=>{const e=o=>{const n=o.target.closest("[data-action]");if(n){o.stopPropagation();const r=n.dataset.action,a=this.getActions()[r];if(a){a(o);return}console.warn(`[${this.roomId}] Unknown data-action: "${r}"`);return}this._handleOutsideClick(o)};document.addEventListener("click",e),this.eventListeners.push({element:document,event:"click",handler:e});const i=o=>{if(o.target.tagName!=="SELECT")return;const n=o.target.closest("[data-action]");if(!n)return;const r=this.getActions()[n.dataset.action];r&&r(o)};document.addEventListener("change",i),this.eventListeners.push({element:document,event:"change",handler:i})},100)}getActions(){return{gentlyLeave:()=>this.gentlyLeave(),toggleSafety:e=>this.toggleSafetyDropdown(e),showInstructions:()=>this.showInstructions(),closeInstructions:()=>this.closeInstructions(),showSchedule:()=>{var e;return(e=this.showScheduleModal)==null?void 0:e.call(this)},closeScheduleModal:()=>{var e;return(e=this.closeScheduleModal)==null?void 0:e.call(this)},toggleDimMode:()=>{var e;return(e=this.toggleDimMode)==null?void 0:e.call(this)},toggleTimer:()=>{var e;return(e=this.toggleTimer)==null?void 0:e.call(this)},adjustTime:e=>{var i;return(i=this.adjustTime)==null?void 0:i.call(this,+this._actionEl(e).dataset.minutes)},toggleSoundSettings:()=>{var e;return(e=this.toggleSoundSettings)==null?void 0:e.call(this)},toggle5minBell:()=>{var e;return(e=this.toggle5minBell)==null?void 0:e.call(this)},toggleAmbientSound:()=>{var e;return(e=this.toggleAmbientSound)==null?void 0:e.call(this)},selectBell:e=>{var i;return(i=this.selectBell)==null?void 0:i.call(this,this._actionEl(e).dataset.value)},selectCompletion:e=>{var i;return(i=this.selectCompletion)==null?void 0:i.call(this,this._actionEl(e).dataset.value)},selectAmbient:e=>{var i;return(i=this.selectAmbient)==null?void 0:i.call(this,this._actionEl(e).dataset.value)},previewSound:e=>{var i;return(i=this.previewSound)==null?void 0:i.call(this,this._actionEl(e).dataset.value,e)},previewAmbient:e=>{var i;return(i=this.previewAmbient)==null?void 0:i.call(this,this._actionEl(e).dataset.value,e)},sendMessage:e=>{var i;return(i=this.sendMessage)==null?void 0:i.call(this,this._actionEl(e).dataset.channel)},switchTab:e=>{var i;return(i=this.switchTab)==null?void 0:i.call(this,this._actionEl(e).dataset.tab)},skipBackward:()=>{var e;return(e=this.skipBackward)==null?void 0:e.call(this)},togglePlayPause:()=>{var e;return(e=this.togglePlayPause)==null?void 0:e.call(this)},skipForward:()=>{var e;return(e=this.skipForward)==null?void 0:e.call(this)}}}_actionEl(e){return e.target.closest("[data-action]")}_handleOutsideClick(e){var o;const i=document.getElementById(`${this.roomId}SafetyDropdownContainer`);if(i&&!i.contains(e.target)){const n=document.getElementById(`${this.roomId}SafetyDropdown`);n&&(n.style.display="none")}(o=this.onOutsideClick)==null||o.call(this,e)}toggleSafetyDropdown(e){e==null||e.stopPropagation();const i=document.getElementById(`${this.roomId}SafetyDropdown`),o=document.getElementById(`${this.roomId}SafetyDropdownContainer`);if(i){if(i.style.display==="block"){i.style.display="none";return}if(o){const{bottom:n,right:r}=o.getBoundingClientRect();Object.assign(i.style,{position:"fixed",top:`${n+6}px`,right:`${window.innerWidth-r}px`,left:"auto",zIndex:"2147483640",marginTop:"0"})}i.style.display="block"}}showInstructions(){var e,i;(e=document.getElementById(`${this.roomId}SafetyDropdown`))==null||e.style.setProperty("display","none"),(i=document.getElementById(`${this.roomId}InstructionsModal`))==null||i.classList.add("active")}closeInstructions(){var e;(e=document.getElementById(`${this.roomId}InstructionsModal`))==null||e.classList.remove("active")}getParticipantText(){return`${this.state.participants} present`}getHeaderGradient(){return"background:linear-gradient(135deg,rgba(139,92,246,0.1) 0%,rgba(168,85,247,0.05) 100%);"}getDevModeBadge(){return""}formatTime(e){return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}registerEventListener(e,i,o){e.addEventListener(i,o),this.eventListeners.push({element:e,event:i,handler:o})}};L._hubPresenceSub=null;L._hubRooms=[];L.ROOM_ACTIVITIES={"silent-room":"🧘 Silent practice","guided-room":"🎧 Guided session","breathwork-room":"💨 Breathwork","campfire-room":"🔥 Around the fire","osho-room":"🌀 Osho space","deepwork-room":"🎯 Deep work","tarot-room":"🔮 Tarot reading","reiki-room":"✨ Reiki session"};L.startHubPresence=async function(t){t&&(L._hubRooms=t);const e=L._hubRooms;if(!e.length)return;if(!(u!=null&&u.ready)){const o=setInterval(()=>{u!=null&&u.ready&&(clearInterval(o),L.startHubPresence())},500);return}L.stopHubPresence();const i=async()=>{const o=await u.getActiveMembers(),n=o.filter(r=>r.is_phantom).length;e.forEach(r=>{const a=o.filter(s=>s.room_id===r.roomId).length;r.state.participants=a+n,r._updateRoomCardCount(a+n)})};await i(),L._hubPresenceSub=u.subscribeToPresence(i)};L.stopHubPresence=function(){if(L._hubPresenceSub){try{L._hubPresenceSub.unsubscribe()}catch{}L._hubPresenceSub=null}};window.PracticeRoom=L;window.dispatchRoomReady=function(t){document.dispatchEvent(new CustomEvent("practiceRoomReady",{detail:{roomKey:t}}))};window.openMemberProfileAboveRoom=function(t){!window.MemberProfileModal||!t||(MemberProfileModal.open(t),requestAnimationFrame(()=>{const e=openMemberProfileAboveRoom._cachedEls;(!e||e.some(i=>!i.isConnected))&&(openMemberProfileAboveRoom._cachedEls=[document.getElementById("memberProfileModal"),document.getElementById("memberProfileOverlay"),document.querySelector(".member-profile-overlay"),document.querySelector(".member-profile-modal"),document.querySelector('[class*="member"][class*="modal"]'),document.querySelector('[id*="memberProfile"]')].filter(Boolean)),openMemberProfileAboveRoom._cachedEls.forEach(i=>{i.style.zIndex="200000"})}))};const Be={ENDED:0,PLAYING:1},At={initPlayerState(){this.state.player=null,this.state.playerReady=!1,this.state.playerInitialized=!1,this.state.sessionStarted=!1,this._progressInterval=null},preloadYouTubeAPI(){if(document.querySelector('script[src*="youtube.com/iframe_api"]'))return;const t=document.createElement("script");t.src="https://www.youtube.com/iframe_api",document.head.appendChild(t)},loadYouTubeAPI(){var e;if((e=window.YT)!=null&&e.Player){this.initPlayer();return}const t=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{t==null||t(),this.initPlayer()}},initPlayer(){if(this.state.playerInitialized)return;const t=this.getCurrentSession();if(!(t!=null&&t.videoId)){console.warn(`[${this.roomId}] No video session available`);return}this.state.player=new YT.Player(`${this.roomId}-youtube-player`,{videoId:t.videoId,playerVars:{autoplay:0,controls:1,modestbranding:1,rel:0,mute:1},events:{onReady:e=>this.onPlayerReady(e),onStateChange:e=>this.onPlayerStateChange(e)}}),this.state.playerInitialized=!0},onPlayerReady(t){var e,i,o,n;this.state.playerReady=!0,t.target.cueVideoById((e=this.getCurrentSession())==null?void 0:e.videoId),this.state.isInSession&&((o=(i=window.Core.state)==null?void 0:i.currentUser)!=null&&o.is_admin)&&this._startAtCycleOffset(t.target),(n=this.onPlayerReadyCustom)==null||n.call(this,t)},_startAtCycleOffset(t){const e=this.config.cycleDuration*1e3,i=this.config.openDuration*1e3,n=(Date.now()-this.state.cycleStartTime)%e,r=Math.max(0,(n-i)/1e3);t.seekTo(r,!0),t.unMute(),t.setVolume(100),t.playVideo(),this.state.sessionStarted=!0,this._showPlayer();const a=this.getCurrentSession();a&&window.Core.showToast(`${a.emoji} Joining session in progress…`)},onPlayerStateChange(t){t.data===Be.PLAYING?this.onVideoPlaying():t.data===Be.ENDED&&this.onVideoEnded()},onVideoPlaying(){this._showPlayer(),this.startProgressTracking()},onVideoEnded(){this.stopProgressTracking(),window.Core.showToast("Session complete")},startSession(){var e,i,o;if(!this.state.playerReady||this.state.sessionStarted)return;const t=this.getCurrentSession();t&&(this._showPlayer(),(e=this.state.player)==null||e.unMute(),(i=this.state.player)==null||i.setVolume(100),(o=this.state.player)==null||o.playVideo(),this.state.sessionStarted=!0,window.Core.showToast(`${t.emoji} Session starting…`))},togglePlayPause(){if(!this.state.player)return;const t=this.state.player.getPlayerState()===Be.PLAYING;t?this.state.player.pauseVideo():this.state.player.playVideo();const e=document.getElementById(`${this.roomId}PlayBtn`);e&&(e.innerHTML=`<span style="font-size:24px;">${t?"▶":"⏸"}</span>`)},_seek(t){this.state.player&&this.state.player.seekTo(Math.max(0,this.state.player.getCurrentTime()+t))},skipBackward(){this._seek(-10)},skipForward(){this._seek(10)},startProgressTracking(){this._progressInterval||(this._progressInterval=setInterval(()=>this.updateTimeDisplay(),1e3))},stopProgressTracking(){this._progressInterval&&(clearInterval(this._progressInterval),this._progressInterval=null)},updateTimeDisplay(){var e;if(!((e=this.state.player)!=null&&e.getCurrentTime))return;const t=document.getElementById(`${this.roomId}TimeDisplay`);if(t){const i=Math.floor(this.state.player.getCurrentTime()),o=Math.floor(this.state.player.getDuration());t.textContent=`${this.formatTime(i)} / ${this.formatTime(o)}`}},_showPlayer(){const t=document.getElementById(`${this.roomId}PlayerOverlay`);t&&(t.style.display="none");const e=document.getElementById(`${this.roomId}Controls`);e&&(e.style.display="flex")},buildPlayerContainer(){const t=this.getCurrentSession();return`
        <div class="guided-player-container" role="region" aria-label="Video player">
            <div id="${this.roomId}-youtube-player"></div>
            <div class="player-overlay" id="${this.roomId}PlayerOverlay">
                <div class="session-info" aria-live="polite">
                    <div class="session-emoji"    id="${this.roomId}SessionEmoji"   >${(t==null?void 0:t.emoji)||"🎧"}</div>
                    <div class="session-title"    id="${this.roomId}SessionTitle"   >${(t==null?void 0:t.title)||"Loading..."}</div>
                    <div class="session-duration" id="${this.roomId}SessionDuration">${(t==null?void 0:t.duration)||"00:00"}</div>
                    <div class="session-starts"   id="${this.roomId}SessionStatus"  >Waiting to start…</div>
                </div>
            </div>
        </div>`},buildPlayerControls(){return`
        <div class="guided-controls" id="${this.roomId}Controls" style="display:none;">
            <div class="control-buttons">
                <button type="button" class="control-btn" aria-label="Skip backward 10 seconds" data-action="skipBackward"><span style="font-size:20px;">⏪</span></button>
                <button type="button" class="control-btn primary" aria-label="Play or pause" data-action="togglePlayPause" id="${this.roomId}PlayBtn"><span style="font-size:24px;">⏸</span></button>
                <button type="button" class="control-btn" aria-label="Skip forward 10 seconds" data-action="skipForward"><span style="font-size:20px;">⏩</span></button>
            </div>
            <div class="time-display" id="${this.roomId}TimeDisplay">0:00 / 0:00</div>
        </div>`},cleanupPlayer(){var t;this.stopProgressTracking(),(t=this.state.player)==null||t.destroy(),this.state.player=null,this.state.playerReady=!1,this.state.playerInitialized=!1,this.state.sessionStarted=!1}},Bt={initCycleState(){this.state.isOpen=!1,this.state.isInSession=!1,this.state.cycleStartTime=null,this.state.nextOpenTime=null,this.state.nextSessionStart=null,this._cycleInterval=null},initializeCycle(){var i;const t=Date.now(),e=this.config.cycleDuration*1e3;this.state.cycleStartTime=t-t%e,(i=this.setSessions)==null||i.call(this,t),this.calculateCycleState(),this._cycleInterval&&clearInterval(this._cycleInterval),this._cycleInterval=setInterval(()=>{this.calculateCycleState(),this.updateRoomCard()},1e3)},calculateCycleState(){var a,s;const t=Date.now(),e=this.config.cycleDuration*1e3,i=this.config.openDuration*1e3,o=(t-this.state.cycleStartTime)%e,n=t-o;n!==this.state.cycleStartTime&&(this.state.cycleStartTime=n,(a=this.setSessions)==null||a.call(this,t));const r=o<i;if(this.state.isOpen=r,this.state.isInSession=!r,r){const l=i-o;this.state.nextSessionStart=t+l,this.state.nextOpenTime=t+l+this.config.sessionDuration*1e3}else this.state.nextOpenTime=t+(e-o),this.state.nextSessionStart=null;this.state.isInSession&&!this.state.sessionStarted&&this.isUserInRoom()&&((s=this.startSession)==null||s.call(this))},isUserInRoom(){var t,e;return((e=(t=window.Core)==null?void 0:t.state)==null?void 0:e.currentRoom)===this.roomId},canEnterRoom(){var t,e;return((e=(t=window.Core.state)==null?void 0:t.currentUser)==null?void 0:e.is_admin)||this.state.isOpen},_checkCycleWindow(){return this.state.isOpen},_formatCountdown(t,e){if(!t)return"";const i=Math.max(0,t-Date.now()),o=Math.floor(i/6e4),n=Math.floor(i%6e4/1e3);return`${e} ${o}:${String(n).padStart(2,"0")}`},getTimeUntilSessionStarts(){return this._formatCountdown(this.state.nextSessionStart,"Session begins in")},getCountdownToNextOpen(){return this._formatCountdown(this.state.nextOpenTime,"Opens in")},getTimerText(){var i,o;const t=((o=(i=this.getNextSession)==null?void 0:i.call(this))==null?void 0:o.title)??"Next Session",e=this.state.isOpen?this.getTimeUntilSessionStarts():this.getCountdownToNextOpen();return`<strong>Next:</strong> ${t}<br>${e}`},buildScheduleLink(){return`
        <button type="button" class="view-schedule" data-action="showSchedule"
                style="text-align:center;font-size:11px;color:var(--text-secondary);text-decoration:underline;cursor:pointer;background:none;border:none;padding:0;display:inline-flex;align-items:center;gap:0.3rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> View Schedule
        </button>`},cleanupCycle(){this._cycleInterval&&(clearInterval(this._cycleInterval),this._cycleInterval=null)}},ye=t=>t.charAt(0).toUpperCase()+t.slice(1);function Re(t,e,i,o){var l,d;const n=i||t.charAt(0).toUpperCase(),r=((d=(l=window.Core)==null?void 0:l.getAvatarGradient)==null?void 0:d.call(l,o||t))??"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",a=e?`<img src="${e}" width="36" height="36" style="width:36px;height:36px;object-fit:cover;border-radius:50%;display:block;flex-shrink:0;" alt="${t}" loading="lazy" decoding="async">`:`<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${n}</span>`,s=e?"background:transparent;":`background:${r};`;return{inner:a,bg:s,gradient:r,initial:n}}const qe=t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),Me={initChatState(t=["main"]){this.chatChannels=t,this.state.messages=Object.fromEntries(t.map(e=>[e,[]]))},async initializeChat(){await Promise.all(this.chatChannels.map(t=>this.loadRoomChatFromDB(t))),setTimeout(()=>this._injectSenderAvatar(),200)},_getDbRoomId(t="main"){return t==="main"?this.roomId:`${this.roomId}-${t}`},_msgContainerId(t){return`${this.roomId}${ye(t)}Messages`},_inputId(t){return`${this.roomId}${ye(t)}Input`},_rowToMsgData(t,e=!1){var c,p;const i=t.profiles||{},o=((p=(c=window.Core)==null?void 0:c.state)==null?void 0:p.currentUser)||{},n=e?o.name||"You":i.name||"Member",r=e?o.avatar_url||"":i.avatar_url||"",a=e?o.emoji||"":i.emoji||"",s=i.id||null,{gradient:l,initial:d}=Re(n,r,a,s);return{name:n,initial:d,avatarUrl:r,avatarBg:l,userId:s,time:qe(t.created_at),text:t.message,country:null}},async sendMessage(t="main",e=null){var c,p,h;const i=document.getElementById(e||this._inputId(t));if(!(i!=null&&i.value.trim()))return;const o=i.value.trim(),n=document.getElementById(this._msgContainerId(t)),r=((p=(c=window.Core)==null?void 0:c.state)==null?void 0:p.currentUser)||{},a=r.name||"You",{gradient:s,initial:l}=Re(a,r.avatar_url||"",r.emoji||"",r.id),d={name:a,initial:l,avatarUrl:r.avatar_url||"",avatarBg:s,userId:r.id||null,time:qe(new Date),text:o,country:null,timestamp:Date.now(),...(h=this.getCustomMessageData)==null?void 0:h.call(this,t)};if(this.state.messages[t].push(d),n&&(n.insertAdjacentHTML("beforeend",this.buildMessageHTML(d)),n.scrollTop=n.scrollHeight),i.value="",window.Core.showToast("Message sent"),u!=null&&u.ready)try{await u.sendRoomMessage(this._getDbRoomId(t),o)}catch(m){console.error("[ChatMixin] sendRoomMessage error:",m)}},async loadRoomChatFromDB(t="main"){var n,r,a;if(!(u!=null&&u.ready)){this.loadMessagesFromStorage(t),this.renderSavedMessages(t);return}const e=this._getDbRoomId(t),i=document.getElementById(this._msgContainerId(t)),o=(a=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)==null?void 0:a.id;try{const[s,l]=await Promise.all([u.getRoomMessages(e,50),u.getBlockedUsers()]);i&&s.length&&(s.filter(d=>{var c;return!l.has((c=d.profiles)==null?void 0:c.id)}).forEach(d=>{var p;const c=((p=d.profiles)==null?void 0:p.id)===o;i.insertAdjacentHTML("beforeend",this.buildMessageHTML(this._rowToMsgData(d,c)))}),i.scrollTop=i.scrollHeight),u.subscribeToRoomChat(e,async d=>{var p,h;((p=d.profiles)==null?void 0:p.id)===o||(await u.getBlockedUsers()).has((h=d.profiles)==null?void 0:h.id)||!i||(i.insertAdjacentHTML("beforeend",this.buildMessageHTML(this._rowToMsgData(d))),i.scrollTop=i.scrollHeight)})}catch(s){console.error(`[ChatMixin] loadRoomChatFromDB error (${t}):`,s)}},buildMessageHTML(t){const e=t.avatarUrl?"":`<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${t.initial}</span>`,i=t.avatarUrl?`background-image:url('${t.avatarUrl}');background-size:cover;background-position:center;`:`background:${t.avatarBg};`,o=t.userId?`<span class="campfire-msg-name" role="button" tabindex="0" style="cursor:pointer;" onclick="openMemberProfileAboveRoom('${t.userId}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${t.userId}');}" aria-label="View profile of ${t.name}">${t.name}</span>`:`<span class="campfire-msg-name">${t.name}</span>`;return`
        <div class="campfire-msg">
            <div class="campfire-msg-avatar" aria-hidden="true" style="${i}width:36px;height:36px;min-width:36px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${e}</div>
            <div class="campfire-msg-content">
                <div class="campfire-msg-header">
                    ${o}
                    ${t.country?`<span class="campfire-msg-country">${t.country}</span>`:""}
                    <span class="campfire-msg-time">${t.time}</span>
                </div>
                <div class="campfire-msg-text">${this._escapeHtml(t.text)}</div>
            </div>
        </div>`},buildChatContainer(t="main",e="Type your message..."){const i=ye(t),o=`${this.roomId}${i}SenderAvatar`,n=`${this.roomId}${i}SendBtn`;return`
        <div class="chat-container" id="${this.roomId}${i}ChatContainer"
             style="display:flex;flex-direction:column;">
            <div class="chat-messages" id="${this.roomId}${i}Messages"></div>
            <div class="chat-input-container" style="padding-top:8px;border-top:none;padding-left:0;padding-right:0;padding-bottom:0;">
                <div style="display:flex;align-items:center;gap:6px;width:100%;flex-wrap:nowrap;box-sizing:border-box;">
                    <div id="${o}" style="flex-shrink:0;width:28px;height:28px;">
                        <div style="width:28px;height:28px;border-radius:50%;background:var(--border);"></div>
                    </div>
                    <input type="text"
                           class="chat-input"
                           id="${this.roomId}${i}Input"
                           aria-label="${e}"
                           placeholder="${e}"
                           onkeypress="if(event.key==='Enter')document.getElementById('${n}')?.click()"
                           style="flex:1;min-width:0;width:100%;">
                    <button type="button" class="chat-send" id="${n}"
                            data-action="sendMessage" data-channel="${t}"
                            aria-label="Send message" style="flex-shrink:0;">
                        <span style="font-size:20px;">→</span>
                    </button>
                </div>
            </div>
        </div>`},_injectSenderAvatar(t=null){var r,a;const e=t?[t]:this.chatChannels||["main"],i=(a=(r=window.Core)==null?void 0:r.state)==null?void 0:a.currentUser;if(!i)return;const{inner:o,bg:n}=Re(i.name||"Me",i.avatar_url||"",i.emoji||"",i.id);e.forEach(s=>{const l=document.getElementById(`${this.roomId}${ye(s)}SenderAvatar`);if(!l)return;const d=i.avatar_url?`width:32px;height:32px;border-radius:50%;background-image:url('${i.avatar_url}');background-size:cover;background-position:center;flex-shrink:0;`:`width:32px;height:32px;border-radius:50%;${n}display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;`,c=i.avatar_url?"":o;l.innerHTML=`<div style="${d}">${c}</div>`})},loadMessagesFromStorage(t="main"){try{const e=localStorage.getItem(`${this.roomId}_messages_${t}`);e&&(this.state.messages[t]=JSON.parse(e))}catch(e){console.error("[ChatMixin] loadMessagesFromStorage error:",e),this.state.messages[t]=[]}},saveMessagesToStorage(t="main"){try{localStorage.setItem(`${this.roomId}_messages_${t}`,JSON.stringify(this.state.messages[t]))}catch(e){console.error("[ChatMixin] saveMessagesToStorage error:",e)}},renderSavedMessages(t="main"){const e=document.getElementById(this._msgContainerId(t)),i=this.state.messages[t];!e||!i.length||(i.forEach(o=>e.insertAdjacentHTML("beforeend",this.buildMessageHTML(o))),e.scrollTop=e.scrollHeight)},clearMessages(t="main"){this.state.messages[t]=[],localStorage.removeItem(`${this.roomId}_messages_${t}`);const e=document.getElementById(this._msgContainerId(t));e&&(e.innerHTML=""),window.Core.showToast("Messages cleared")},capitalize:ye,_escapeHtml(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}},Rt=[{value:"tingsha",label:"Tingsha Bells"},{value:"bowl",label:"Singing Bowl"},{value:"chime",label:"Wind Chime"}],Lt=[{value:"tibetan",label:"Tibetan Bowl"},{value:"gong",label:"Temple Gong"},{value:"bell",label:"Temple Bell"}],Pt=[{value:"stream",label:"Gentle Stream"},{value:"rain",label:"Soft Rain"},{value:"forest",label:"Forest Birds"},{value:"ocean",label:"Ocean Waves"}],Ve={stream:"https://cdn.pixabay.com/audio/2022/03/10/audio_2ded6c2d03.mp3",rain:"https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce70.mp3",forest:"https://cdn.pixabay.com/audio/2021/10/19/audio_e7fb33e943.mp3",ocean:"https://cdn.pixabay.com/audio/2021/09/06/audio_6f8e47c21a.mp3"},zt={tingsha:{baseFreq:900,partials:[{mult:1,gain:.6,decay:2.5},{mult:2.76,gain:.3,decay:1.8},{mult:5.4,gain:.15,decay:1}]},bowl:{baseFreq:220,partials:[{mult:1,gain:.7,decay:6},{mult:2.71,gain:.35,decay:4},{mult:5.2,gain:.12,decay:2.5}]},chime:{baseFreq:1200,partials:[{mult:1,gain:.5,decay:1.5},{mult:1.86,gain:.25,decay:1},{mult:3.01,gain:.1,decay:.6}]},tibetan:{baseFreq:180,partials:[{mult:1,gain:.7,decay:8},{mult:2.68,gain:.4,decay:6},{mult:5.1,gain:.15,decay:3.5}]},gong:{baseFreq:80,partials:[{mult:1,gain:.8,decay:6},{mult:2.2,gain:.5,decay:5},{mult:3.5,gain:.25,decay:3.5},{mult:5,gain:.1,decay:2}]},bell:{baseFreq:440,partials:[{mult:1,gain:.65,decay:4},{mult:2.75,gain:.3,decay:3},{mult:5.4,gain:.12,decay:1.8}]}},lt={initSoundState(){this.state.fiveMinBellEnabled=!1,this.state.ambientEnabled=!1,this.state.selectedBell="tingsha",this.state.selectedCompletion="tibetan",this.state.selectedAmbient="stream",this._audioCtx=null,this._ambientAudio=null},_getAudioCtx(){return this._audioCtx||(this._audioCtx=new(window.AudioContext||window.webkitAudioContext)),this._audioCtx.state==="suspended"&&this._audioCtx.resume(),this._audioCtx},_playBellProfile(t,e=1){const i=zt[t];if(!i)return;const o=this._getAudioCtx(),n=o.currentTime;i.partials.forEach(({mult:r,gain:a,decay:s})=>{const l=o.createOscillator(),d=o.createGain();l.type="sine",l.frequency.setValueAtTime(i.baseFreq*r,n),d.gain.setValueAtTime(a*e,n),d.gain.exponentialRampToValueAtTime(1e-4,n+s),l.connect(d),d.connect(o.destination),l.start(n),l.stop(n+s)})},toggleSoundSettings(){var t;(t=document.getElementById(`${this.roomId}SoundSettings`))==null||t.classList.toggle("visible")},_toggleFeature(t,e,i,o,n,r){var l,d;const a=!this.state[t];this.state[t]=a,(l=document.getElementById(e))==null||l.classList.toggle("active",a);const s=document.getElementById(i);s&&(s.style.display=a?"block":"none"),window.Core.showToast(`${o} ${a?"enabled":"disabled"}`),(d=a?n:r)==null||d.call(this)},toggle5minBell(){this._toggleFeature("fiveMinBellEnabled",`${this.roomId}Toggle5min`,`${this.roomId}5minOptions`,"5-minute bell")},toggleAmbientSound(){this._toggleFeature("ambientEnabled",`${this.roomId}ToggleAmbient`,`${this.roomId}AmbientOptions`,"Ambient sound",this.playAmbientSound,this.stopAmbientSound)},selectBell(t){this.state.selectedBell=t},selectCompletion(t){this.state.selectedCompletion=t},selectAmbient(t){this.state.selectedAmbient=t,this.state.ambientEnabled&&(this.stopAmbientSound(),this.playAmbientSound())},previewSound(t,e){e==null||e.stopPropagation(),this._playBellProfile(t),window.Core.showToast(`▶ ${t}`)},previewAmbient(t,e){e==null||e.stopPropagation();const i=Ve[t];if(!i)return;this._previewAudio&&(this._previewAudio.pause(),this._previewAudio=null);const o=new Audio(i);o.volume=.5,o.play().catch(()=>window.Core.showToast("Preview unavailable")),this._previewAudio=o,setTimeout(()=>{o.pause(),this._previewAudio=null},4e3),window.Core.showToast(`▶ ${t}`)},playAmbientSound(){const t=Ve[this.state.selectedAmbient];if(!t)return;this.stopAmbientSound();const e=new Audio(t);e.loop=!0,e.volume=.35,e.play().catch(()=>window.Core.showToast("Ambient audio unavailable")),this._ambientAudio=e},stopAmbientSound(){this._ambientAudio&&(this._ambientAudio.pause(),this._ambientAudio.src="",this._ambientAudio=null)},play5MinBell(){this.state.fiveMinBellEnabled&&(this._playBellProfile(this.state.selectedBell,.7),window.Core.showToast("5-minute bell"))},playCompletionSound(){this._playBellProfile(this.state.selectedCompletion,1),window.Core.showToast("Session complete")},cleanupSound(){this.stopAmbientSound(),this._previewAudio&&(this._previewAudio.pause(),this._previewAudio=null),this._audioCtx&&(this._audioCtx.close(),this._audioCtx=null)},_soundOption(t,e,i,o,n){const r=this.state[`selected${t}`]===e;return`
        <div class="sound-option">
            <button type="button" class="sound-select-btn${r?" active":""}"
                    data-action="${n}" data-value="${e}"
                    aria-pressed="${r}"
                    style="flex:1;text-align:left;background:none;border:none;cursor:pointer;padding:4px 0;color:var(--text);font-size:14px;">
                ${r?"✓ ":""}${i}
            </button>
            <button type="button" class="sound-preview-btn"
                    data-action="${o}" data-value="${e}"
                    aria-label="Preview ${i}">▶</button>
        </div>`},buildSoundSettings(){const t=this.roomId,e=Rt.map(n=>this._soundOption("Bell",n.value,n.label,"previewSound","selectBell")).join(""),i=Lt.map(n=>this._soundOption("Completion",n.value,n.label,"previewSound","selectCompletion")).join(""),o=Pt.map(n=>this._soundOption("Ambient",n.value,n.label,"previewAmbient","selectAmbient")).join("");return`
        <div class="sound-settings" id="${t}SoundSettings">

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">5-Minute Bell</span>
                    <div class="toggle-switch" id="${t}Toggle5min" role="switch" aria-checked="false" tabindex="0"
                         data-action="toggle5minBell"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${t}5minOptions" style="display:none;">${e}</div>
            </div>

            <div class="sound-section">
                <div class="sound-section-title">Completion Sound</div>
                ${i}
            </div>

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">Ambient Sound</span>
                    <div class="toggle-switch" id="${t}ToggleAmbient" role="switch" aria-checked="false" tabindex="0"
                         data-action="toggleAmbientSound"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${t}AmbientOptions" style="display:none;">${o}</div>
            </div>

        </div>`},buildSoundButton(){return`
        <button type="button" class="ps-leave"
                data-action="toggleSoundSettings"
                aria-label="Sound settings" aria-expanded="false"
                style="background:var(--surface);color:var(--text);padding:10px 16px;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Sound
        </button>`}},ze=180,Ye=+(2*Math.PI*ze).toFixed(2),Dt=60,jt=7200,Ke={idle:"Begin",running:"Pause",paused:"Continue",done:"Complete"},dt={initTimerState(t=1200){this.state.timerRunning=!1,this.state.timeLeft=t,this.state.initialTime=t,this._timerInterval=null,this._timerHiddenAt=null,this._timerVisibilityHandler=null},toggleTimer(){this.state.timerRunning?this.pauseTimer():this.startTimer()},startTimer(){this.state.timerRunning||(this.state.timerRunning=!0,this._timerTickStart=Date.now(),this._setTimerBtn("running"),this._setTimerGlow("running"),this._timerInterval=setInterval(()=>{var t;this.state.timeLeft--,this._updateTimer(),this.state.timeLeft>0&&this.state.timeLeft%300===0&&this.state.fiveMinBellEnabled&&((t=this.play5MinBell)==null||t.call(this)),this.state.timeLeft<=0&&this.completeTimer()},1e3),this._attachVisibilityHandler(),window.Core.showToast("Timer started"))},pauseTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1,this._setTimerBtn("paused"),this._setTimerGlow("paused")},completeTimer(){var t,e;this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1,this.state.timeLeft=0,this._setTimerBtn("done"),this._updateTimer(),this._setTimerGlow("idle"),(t=this.playCompletionSound)==null||t.call(this),window.Core.showToast("Session complete!"),(e=this.onTimerComplete)==null||e.call(this)},resetTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1,this.state.timeLeft=this.state.initialTime,this._setTimerBtn("idle"),this._updateTimer(),this._setTimerGlow("idle")},adjustTime(t){this.state.timerRunning||(this.state.timeLeft=Math.min(jt,Math.max(Dt,this.state.timeLeft+t*60)),this.state.initialTime=this.state.timeLeft,this._updateTimer())},cleanupTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1},_attachVisibilityHandler(){this._timerVisibilityHandler||(this._timerVisibilityHandler=()=>{if(document.hidden)this._timerHiddenAt=Date.now(),this._clearInterval();else{if(this._timerHiddenAt!==null){const t=Math.round((Date.now()-this._timerHiddenAt)/1e3);if(this._timerHiddenAt=null,this.state.timeLeft=Math.max(0,this.state.timeLeft-t),this._updateTimer(),this.state.timeLeft<=0){this.completeTimer();return}}this.state.timerRunning&&!this._timerInterval&&(this._timerInterval=setInterval(()=>{var t;this.state.timeLeft--,this._updateTimer(),this.state.timeLeft>0&&this.state.timeLeft%300===0&&this.state.fiveMinBellEnabled&&((t=this.play5MinBell)==null||t.call(this)),this.state.timeLeft<=0&&this.completeTimer()},1e3))}},document.addEventListener("visibilitychange",this._timerVisibilityHandler))},_detachVisibilityHandler(){this._timerVisibilityHandler&&(document.removeEventListener("visibilitychange",this._timerVisibilityHandler),this._timerVisibilityHandler=null),this._timerHiddenAt=null},_clearInterval(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)},_setTimerBtn(t){const e=document.getElementById(`${this.roomId}TimerBtn`);e&&(e.textContent=Ke[t])},_updateTimer(){const t=document.getElementById(`${this.roomId}TimerDisplay`);t&&(t.textContent=this.formatTime(this.state.timeLeft));const e=document.getElementById(`${this.roomId}TimerRing`);if(e){const i=this.state.timeLeft/this.state.initialTime;e.style.strokeDashoffset=Ye*(1-i)}},updateTimerDisplay(){this._updateTimer()},updateTimerRing(){this._updateTimer()},buildTimerContainer({subtitle:t="in practice",gradientId:e=`timerGrad_${this.roomId}`,color1:i="#a78bfa",color2:o="#c084fc",glowColor:n="rgba(167,139,250,0.35)",subtitleHtml:r=null}={}){this._glowColor=n;const a=Ye,s=163,l=+(2*Math.PI*s).toFixed(2),d=+(l*35/360).toFixed(2),c=+(l*120/360).toFixed(2),p=+(l-d).toFixed(2),h=+(l-c).toFixed(2),m=r??`<div style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${t}</div>`;return`
        <style>
            /* Outer ring glow pulse while running */
            @keyframes timerGlow_${this.roomId} {
                0%,100% { filter: drop-shadow(0 0 6px ${n}) drop-shadow(0 0 18px ${n}) drop-shadow(0 0 35px ${n}); }
                50%      { filter: drop-shadow(0 0 12px ${n}) drop-shadow(0 0 35px ${n}) drop-shadow(0 0 70px ${n}); }
            }
            #${this.roomId}OuterSvg {
                filter: none;
                transition: filter 1.5s ease;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}OuterSvg {
                animation: timerGlow_${this.roomId} 3s ease-in-out infinite;
                transition: none;
            }

            /* Comet head races clockwise: dashoffset 0 → -C in 1s */
            @keyframes cometHead_${this.roomId} {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -${l}; }
            }
            /* Trail follows, slightly delayed */
            @keyframes cometTrail_${this.roomId} {
                from { stroke-dashoffset: ${d}; }
                to   { stroke-dashoffset: ${d-l}; }
            }

            #${this.roomId}CometHead {
                stroke-dasharray:  ${d} ${p};
                stroke-dashoffset: 0;
                animation: cometHead_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}CometTrail {
                stroke-dasharray:  ${c} ${h};
                stroke-dashoffset: ${d};
                animation: cometTrail_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometHead,
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometTrail {
                animation-play-state: running;
            }
            /* Comet: hidden until timer starts, freezes on pause, hides on reset */
            #${this.roomId}CometSvg {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometSvg {
                opacity: 1;
            }
            #${this.roomId}TimerRingWrap.paused #${this.roomId}CometSvg {
                opacity: 1; /* visible but animation is paused = frozen */
            }
            #${this.roomId}TimerDisplay {
                font-variant-numeric: tabular-nums;
            }
            @media (prefers-reduced-motion: reduce) {
                #${this.roomId}CometHead,
                #${this.roomId}CometTrail {
                    animation: none !important;
                }
                #${this.roomId}OuterSvg {
                    animation: none !important;
                }
            }
        </style>

        <div id="${this.roomId}TimerRingWrap"
             aria-hidden="true"
             style="position:relative;width:min(380px,82vw);height:min(380px,82vw);margin-bottom:36px;">

            <!-- Outer progress ring (clockwise countdown) -->
            <svg id="${this.roomId}OuterSvg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:2;">
                <defs>
                    <linearGradient id="${e}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stop-color="${i}"/>
                        <stop offset="100%" stop-color="${o}"/>
                    </linearGradient>
                </defs>
                <!-- Track -->
                <circle cx="200" cy="200" r="${ze}"
                        fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="14"/>
                <!-- Progress -->
                <circle cx="200" cy="200" r="${ze}"
                        fill="none" stroke="url(#${e})"
                        stroke-width="14" stroke-linecap="round"
                        stroke-dasharray="${a}" stroke-dashoffset="0"
                        id="${this.roomId}TimerRing"/>
            </svg>

            <!-- Inner dark track (always visible) -->
            <svg width="100%" height="100%" viewBox="0 0 400 400"
                 style="position:absolute;top:0;left:0;z-index:3;">
                <circle cx="200" cy="200" r="${s}"
                        fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="6"/>
            </svg>

            <!-- Inner comet ring (hidden until Start) -->
            <svg id="${this.roomId}CometSvg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:4;">
                <!-- Fading trail (neon blue, low opacity) -->
                <circle cx="200" cy="200" r="${s}"
                        fill="none" stroke="#00cfff"
                        stroke-width="5" stroke-linecap="round"
                        opacity="0.25"
                        id="${this.roomId}CometTrail"/>
                <!-- Comet head (bright neon blue, glowing) -->
                <circle cx="200" cy="200" r="${s}"
                        fill="none"
                        stroke="#00eeff"
                        stroke-width="6" stroke-linecap="round"
                        style="filter:drop-shadow(0 0 4px #00eeff) drop-shadow(0 0 10px #00cfff);"
                        id="${this.roomId}CometHead"/>
            </svg>

            <!-- Text content -->
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:5;width:65%;">
                <div id="${this.roomId}TimerDisplay"
                     role="timer" aria-live="off" aria-label="Timer"
                     style="font-size:clamp(2.8rem,12vw,5rem);font-weight:200;letter-spacing:0.04em;line-height:1;margin-bottom:10px;">
                    ${this.formatTime(this.state.timeLeft)}
                </div>
                ${m}
            </div>
        </div>`},buildTimerControls(){return`
        <div class="timer-controls" role="group" aria-label="Timer controls">
            <button type="button" class="t-btn" data-action="adjustTime" data-minutes="-5" aria-label="Subtract 5 minutes">−5m</button>
            <button type="button" class="t-btn primary" data-action="toggleTimer" id="${this.roomId}TimerBtn" aria-live="polite">${Ke.idle}</button>
            <button type="button" class="t-btn" data-action="adjustTime" data-minutes="5" aria-label="Add 5 minutes">+5m</button>
        </div>`},_setTimerGlow(t){const e=document.getElementById(`${this.roomId}TimerRingWrap`),i=document.getElementById(`${this.roomId}OuterSvg`);!e||!i||(clearTimeout(this._glowTransitionTimer),e.classList.remove("running","paused"),t==="running"&&e.classList.add("running"),t==="paused"&&e.classList.add("paused"),t==="running"?(i.style.animation="",i.style.transition="filter 1.2s ease",i.style.filter=`drop-shadow(0 0 12px ${this._glowColor}) drop-shadow(0 0 35px ${this._glowColor}) drop-shadow(0 0 70px ${this._glowColor})`,this._glowTransitionTimer=setTimeout(()=>{e.classList.add("running"),requestAnimationFrame(()=>{i.style.transition="",i.style.filter=""})},1200)):(i.style.animation="none",i.style.transition="filter 1.2s ease",i.style.filter="none"))}},be={FLOATING_ELEMENT_COUNT:20,UPDATE_INTERVAL_MS:6e5,STORAGE_PREFIX:"solar_",STORAGE_KEY_SUFFIX:"_data",IMAGE_BASE_URL:"/Community/Solar/",MIN_REFLECTION_LENGTH:10,FLOATING_ELEMENT_DURATION_MIN:10,FLOATING_ELEMENT_DURATION_RANGE:10,FLOATING_ELEMENT_DELAY_MAX:5},Ht={escapeHtml(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML},escapeAttr(t){return t?t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""},_closingBlock:t=>`<div class="solar-popup-highlight">
       <p><strong>Closing Line:</strong> "${t}"</p>
     </div>`,generateIntentionPracticeContent(t,e,i){const o=e.map(n=>`<button type="button" data-affirmation="${this.escapeAttr(n)}" class="solar-affirmation-btn">
         ${this.escapeHtml(n)}
       </button>`).join("");return`
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${i.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Set Your Intention</h3>
        <p>${i.intentionPrompt}</p>
        <label for="intentionText" class="sr-only">Your seasonal intention</label>
        <textarea id="intentionText" class="solar-textarea"
          placeholder="${i.intentionPlaceholder}" maxlength="500"
          aria-label="Your seasonal intention"
          style="min-height:100px;margin:1rem 0;"
        >${this.escapeHtml(t.intention||"")}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${i.affirmationTitle||"Choose Affirmation"}</h3>
        <p>Select one affirmation or write your own:</p>
        <div class="solar-affirmations-grid">${o}</div>
        <label for="affirmationText" class="sr-only">Your affirmation</label>
        <textarea id="affirmationText" class="solar-textarea"
          placeholder="Or write your own..." maxlength="300"
          aria-label="Your affirmation"
          style="min-height:80px;margin-top:1rem;"
        >${this.escapeHtml(t.affirmation||"")}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${i.listTitle}</h3>
        <p>${i.listPrompt}</p>
        <label for="releaseListText" class="sr-only">${i.listTitle}</label>
        <textarea id="releaseListText" class="solar-textarea"
          placeholder="1. &#10;2. &#10;3. " maxlength="1000"
          aria-label="${i.listTitle}"
          style="min-height:120px;margin:1rem 0;"
        >${this.escapeHtml(t.releaseList||"")}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>Read Aloud</h3>
        <p>${i.readAloudText}</p>
      </div>

      ${this._closingBlock(i.closingLine)}
    `},generateFutureAlignmentContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section"><h3>Close Your Eyes</h3><p>${t.visualizationPrompt}</p></div>
      <div class="solar-popup-section"><h3>Notice Sensations</h3><p>Observe posture, breath, and energy tone.</p></div>
      <div class="solar-popup-section"><h3>${t.feelingTitle}</h3><p>${t.feelingPrompt}</p></div>
      ${this._closingBlock(t.closingLine)}
    `},generateBodyPracticeContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Practice Steps</h3>
        <ul class="solar-practice-steps">
          ${t.steps.map(e=>`<li>${e}</li>`).join("")}
        </ul>
      </div>
      ${t.subtleMovement?`<div class="solar-popup-section"><h3>Subtle Movement</h3><p>${t.subtleMovement}</p></div>`:""}
      ${this._closingBlock(t.closingLine)}
    `},generateEnergyAwarenessContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Energy Direction</h3>
        <ul class="solar-practice-steps">
          ${t.energySteps.map(e=>`<li>${e}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Sense ${t.energyQuality}</h3>
        <p>${t.energyGuideline}</p>
      </div>
      <div class="solar-popup-section">
        <h3>Awareness Check</h3>
        <p>Notice subtle warmth, vibration, or light in your body.</p>
      </div>
      ${this._closingBlock(t.closingLine)}
    `},generateEnvironmentalClearingContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Choose One Small Space</h3>
        <p>A desk, a drawer, a digital folder, or your phone home screen.</p>
      </div>
      <div class="solar-popup-section"><h3>Remove Items</h3><p>${t.removePrompt}</p></div>
      ${this._closingBlock(t.closingLine)}
    `},generateRolePracticeContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Identify Your Roles</h3>
        <p>Select roles you actively play:</p>
        <ul class="solar-practice-steps">
          ${t.roleExamples.map(e=>`<li>${e}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>${t.actionTitle}</h3>
        <p>${t.actionPrompt}</p>
      </div>
      ${this._closingBlock(t.closingLine)}
    `},generatePacePracticeContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Assess Your Pace</h3>
        <p>Answer: "At what pace am I currently living?"</p>
        <ul class="solar-practice-steps">
          ${t.paceOptions.map(e=>`<li>${e}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Choose a Small Adjustment</h3>
        <p>${t.adjustmentPrompt}</p>
        <ul class="solar-practice-steps">
          ${t.adjustmentExamples.map(e=>`<li>${e}</li>`).join("")}
        </ul>
      </div>
      ${this._closingBlock(t.closingLine)}
    `},generateRelationshipAuditContent(t){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${t.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Identify Key Connections</h3>
        <p>${t.identifyPrompt}</p>
      </div>
      <div class="solar-popup-section">
        <h3>Decide One Action per Relationship</h3>
        <p>For each person, choose one action:</p>
        <ul class="solar-practice-steps">
          ${t.actionExamples.map(e=>`<li>${e}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Integrate Awareness</h3>
        <p>${t.integrationPrompt}</p>
      </div>
      ${this._closingBlock(t.closingLine)}
    `}},Ce={CONSTANTS:{DEFAULT_STAR_COUNT:50,AVATAR_MAX_DISPLAY:5,AVATAR_COLORS:["#8B7AFF","#FF9B71","#71E8FF","#FFD371","#FF71B4"],AVATAR_INITIALS:["L","S","N","A","M"],WORD_CLOUD_COLORS:["#8B7AFF","#FF9B71","#71E8FF","#FFD371","#FF71B4","#71ffaa"],WORD_CLOUD_SIZES:[1,1.2,1.4,1.6,1.8,2,1.3,1.1,1.5,1.7]},_stylesInjected:!1,generateStarfield(t=Ce.CONSTANTS.DEFAULT_STAR_COUNT){const e=[];for(let i=0;i<t;i++)e.push(`<div class="lunar-star" style="left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${(Math.random()*3).toFixed(2)}s;opacity:${(Math.random()*.5+.3).toFixed(2)};"></div>`);return e.join("")},renderTopBar({emoji:t,name:e,daysText:i,livingPresenceCount:o,cssPrefix:n}){return`
            <div class="${n}-top-bar lunar-top-bar">
                <div class="${n}-phase-left lunar-phase-left">
                    <div class="${n}-moon-icon lunar-moon-icon-large">${t}</div>
                    <div class="${n}-phase-info lunar-phase-info">
                        <h2>${e}</h2>
                        <p>${i}</p>
                    </div>
                </div>
                <div class="${n}-live-count-top lunar-live-count-top">
                    <div class="lunar-pulse-dot"></div>
                    <span id="lunarLiveCountTop">${o} members practicing with you now</span>
                </div>
                <button type="button" data-action="back-to-hub" class="lunar-back-hub-btn" aria-label="Leave practice and return to hub">
                    Gently Leave
                </button>
            </div>`},renderMoonVisual({cssPrefix:t,sphereClass:e,glowClass:i}){return`
            <div class="${t}-moon-visual lunar-moon-visual">
                <div class="${i} lunar-moon-glow">
                    <div class="${e} lunar-moon-sphere"></div>
                </div>
            </div>`},renderIntroCard({imageUrl:t,description:e}){return`
            <div class="lunar-intro-card">
                <picture>
                  <source srcset="${t}" type="image/webp">
                  <img src="${t.replace(".webp",".png")}" alt="Moon Phase" width="400" height="400" class="lunar-intro-image" loading="lazy" decoding="async">
                </picture>
                <p>${e}</p>
            </div>`},renderModeToggle({cssPrefix:t}){return`
            <div class="${t}-mode-toggle lunar-mode-toggle">
                <button type="button" class="lunar-mode-btn active" data-mode="solo" data-action="switch-mode" aria-pressed="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Solo Practice</span>
                </button>
                <button type="button" class="lunar-mode-btn" data-mode="group" data-action="switch-mode" aria-pressed="false">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Group Circle</span>
                </button>
            </div>`},renderMockAvatars(t){const{AVATAR_MAX_DISPLAY:e,AVATAR_COLORS:i,AVATAR_INITIALS:o}=Ce.CONSTANTS,n=Math.min(t,e);return Array.from({length:n},(a,s)=>`<div class="lunar-avatar" style="background-color:${i[s]};animation-delay:${s*.1}s;"
                  aria-label="Member ${o[s]}">${o[s]}</div>`).join("")+`<div class="lunar-avatar lunar-join-avatar" role="button" tabindex="0" aria-label="Join circle" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><span aria-hidden="true">+</span></div>`},renderWordCloud(t){if(!Array.isArray(t)||!t.length)return'<p style="color:rgba(224,224,255,0.6);">No words yet</p>';const{WORD_CLOUD_COLORS:e,WORD_CLOUD_SIZES:i}=Ce.CONSTANTS;return t.map((o,n)=>`<div class="lunar-word-cloud-item"
                  style="font-size:${i[n%i.length]}rem;color:${e[n%e.length]};animation-delay:${(n*.1).toFixed(1)}s;"
                  aria-label="Intention: ${o.word}">${o.word}</div>`).join("")},renderWisdomText(t){return`<div class="lunar-wisdom-text">"${t}"</div>`},createPopup({icon:t,title:e,subtitle:i,content:o,cssPrefix:n,hasFooter:r=!0}){const a=document.createElement("div");return a.className=`lunar-practice-popup ${n}-practice-popup`,a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-labelledby","popup-title"),a.setAttribute("aria-describedby","popup-subtitle"),a.innerHTML=`
            <div class="lunar-popup-content ${n}-popup-content">
                <button type="button" class="lunar-popup-close" data-action="close-popup" aria-label="Close">close</button>
                <div class="lunar-popup-header">
                    <div class="lunar-popup-icon" aria-hidden="true">${t}</div>
                    <div class="lunar-popup-title">
                        <h2 id="popup-title">${e}</h2>
                        <p class="lunar-popup-subtitle" id="popup-subtitle">${i}</p>
                    </div>
                </div>
                <div class="lunar-popup-body" id="collectiveIntentionContent">${o}</div>
                ${r?'<div class="lunar-popup-footer"><button type="button" class="lunar-popup-btn" data-action="close-popup" aria-label="Close practice">Close Practice</button></div>':""}
            </div>`,a},injectStyles(){if(this._stylesInjected||document.getElementById("lunar-shared-styles")){this._stylesInjected=!0;return}const t=document.createElement("style");t.id="lunar-shared-styles",t.textContent=this._getSharedCSS(),document.head.appendChild(t),this._stylesInjected=!0},_getSharedCSS(){return`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

/* ── Layout ──────────────────────────────────────────────────────────────── */
.lunar-room-bg{min-height:100vh;width:100%;background:transparent;position:relative;overflow-x:clip;}
.lunar-content-wrapper{position:relative;z-index:5;max-width:1200px;margin:0 auto;padding-top:6rem;}

/* ── Starfield ───────────────────────────────────────────────────────────── */
.lunar-starfield{position:fixed;inset:0;pointer-events:none;z-index:0;}
.lunar-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:lunar-twinkle 3s infinite;}
@keyframes lunar-twinkle{0%,100%{opacity:.3}50%{opacity:1}}

/* ── Top bar ─────────────────────────────────────────────────────────────── */
.lunar-top-bar{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;
    padding:1.5rem 2rem;background:rgba(10,10,26,.85);backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(255,255,255,.08);}
.lunar-phase-left{display:flex;align-items:center;gap:1.5rem;}
.lunar-moon-icon-large{font-size:3rem;filter:drop-shadow(0 0 10px rgba(255,255,255,.3));}
.lunar-phase-info h2{margin:0;font-size:1.5rem;color:#e0e0ff;font-family:'Cormorant Garamond',serif;}
.lunar-phase-info p{margin:.5rem 0 0;color:rgba(224,224,255,.7);font-size:.95rem;}
.lunar-live-count-top{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.5rem;
    background:rgba(139,122,255,.15);border-radius:50px;border:1px solid rgba(139,122,255,.3);}
.lunar-live-count-top span{color:rgba(224,224,255,.9);font-size:.95rem;font-weight:500;}
.lunar-pulse-dot{width:8px;height:8px;background:#8B7AFF;border-radius:50%;animation:lunar-pulse 2s infinite;}
@keyframes lunar-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}
.lunar-back-hub-btn{padding:.75rem 1.75rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    color:#e0e0ff;font-size:.9rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    letter-spacing:.05em;cursor:pointer;transition:all .35s;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-back-hub-btn:hover{border-color:rgba(139,122,255,.7);color:#fff;
    box-shadow:0 0 40px rgba(139,122,255,.3),inset 0 0 16px rgba(139,122,255,.12);transform:translateY(-2px);}

/* ── Moon visual ─────────────────────────────────────────────────────────── */
.lunar-moon-visual{display:flex;justify-content:center;margin:3rem 0;}
.lunar-moon-glow{position:relative;width:220px;height:220px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.lunar-moon-sphere{position:relative;width:160px;height:160px;border-radius:50%;animation:lunar-float 6s ease-in-out infinite;overflow:hidden;}

.lunar-moon-glow::after{content:'';position:absolute;inset:-20px;border-radius:50%;animation:lunar-glow-pulse 4s ease-in-out infinite;pointer-events:none;}

@keyframes lunar-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes lunar-glow-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}

/* ── NEW MOON 🌑 ─────────────────────────────────────────────────────────── */
.newmoon-moon-sphere{
    background:radial-gradient(circle at 38% 38%, #1a1a2e 60%, #0d0d1a 100%);
    box-shadow:inset -6px -6px 18px rgba(255,255,255,.08), inset 4px 4px 12px rgba(255,255,255,.04);
}
.newmoon-moon-glow::after{background:radial-gradient(circle,rgba(100,100,180,.25) 0%,transparent 70%);}

/* ── WAXING MOON 🌓 ──────────────────────────────────────────────────────── */
.waxingmoon-moon-sphere{
    background:radial-gradient(circle at 65% 40%, #f0e8d0 0%, #d4c9a8 40%, #b8ad8c 70%, #9a9278 100%);
    box-shadow:0 0 40px rgba(210,195,150,.35), 0 0 80px rgba(210,195,150,.15);
}
.waxingmoon-moon-sphere::before{
    content:'';position:absolute;inset:0;border-radius:50%;
    background:radial-gradient(ellipse 120% 100% at 15% 50%, #0a0a1a 45%, transparent 70%);
}
.waxingmoon-moon-glow::after{background:radial-gradient(circle,rgba(210,195,150,.4) 0%,transparent 65%);}

/* ── FULL MOON 🌕 ────────────────────────────────────────────────────────── */
.fullmoon-moon-sphere{
    background:
        radial-gradient(circle at 38% 32%, rgba(0,0,0,.07) 0%, transparent 18%),
        radial-gradient(circle at 62% 55%, rgba(0,0,0,.05) 0%, transparent 12%),
        radial-gradient(circle at 48% 68%, rgba(0,0,0,.04) 0%, transparent 10%),
        radial-gradient(circle at 62% 38%, #ffffff 0%, #f5f0e0 35%, #e8dfc0 65%, #d4c9a0 100%);
    box-shadow:0 0 50px rgba(255,245,200,.6), 0 0 100px rgba(255,245,200,.3), 0 0 160px rgba(255,245,200,.1);
}
.fullmoon-moon-glow::after{background:radial-gradient(circle,rgba(255,245,200,.55) 0%,transparent 65%);}

/* ── WANING MOON 🌗 ──────────────────────────────────────────────────────── */
.waningmoon-moon-sphere{
    background:radial-gradient(circle at 35% 40%, #e8dfc0 0%, #c8bd9c 40%, #a8a07c 70%, #8a8260 100%);
    box-shadow:0 0 40px rgba(190,180,130,.3), 0 0 80px rgba(190,180,130,.12);
}
.waningmoon-moon-sphere::before{
    content:'';position:absolute;inset:0;border-radius:50%;
    background:radial-gradient(ellipse 120% 100% at 85% 50%, #0a0a1a 45%, transparent 70%);
}
.waningmoon-moon-glow::after{background:radial-gradient(circle,rgba(190,180,130,.35) 0%,transparent 65%);}


/* ── Intro card ──────────────────────────────────────────────────────────── */
.lunar-intro-card{text-align:center;margin:2rem 0;}
.lunar-intro-image{width:100%;max-width:500px;height:auto;margin:0 auto 1.5rem;display:block;filter:invert(1);}
.lunar-intro-card p{color:rgba(224,224,255,.8);font-size:1.1rem;line-height:1.8;max-width:600px;
    margin:0 auto;font-family:'Cormorant Garamond',serif;}

/* ── Mode toggle ─────────────────────────────────────────────────────────── */
.lunar-mode-toggle{display:flex;gap:.5rem;margin:2rem 0;justify-content:center;
    background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.07);border-radius:50px;padding:.35rem;}
.lunar-mode-btn{display:flex;align-items:center;gap:.6rem;padding:.75rem 2rem;
    background:transparent;border:none;border-radius:50px;
    color:rgba(224,224,255,.45);font-size:.9rem;font-family:'Cormorant Garamond',serif;
    font-style:italic;letter-spacing:.04em;cursor:pointer;transition:all .35s;}
.lunar-mode-btn:hover{color:rgba(224,224,255,.75);}
.lunar-mode-btn.active{
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);color:#e0e0ff;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-mode-btn svg{flex-shrink:0;opacity:.7;}
.lunar-mode-btn.active svg{opacity:1;}

/* ── Practice modes ──────────────────────────────────────────────────────── */
.lunar-practice-mode{display:none;animation:lunar-fade-in .5s ease-out;}
.lunar-practice-mode.active{display:block;}
.lunar-mode-description{text-align:center;margin:2rem 0 3rem;}
.lunar-mode-description h3{color:#e0e0ff;font-size:1.8rem;font-family:'Cormorant Garamond',serif;margin-bottom:.5rem;}
.lunar-mode-description p{color:rgba(224,224,255,.7);font-size:1.1rem;line-height:1.6;}

/* ── Practice grid ───────────────────────────────────────────────────────── */
.lunar-practices-section{margin:3rem 0;}
.lunar-practices-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:2rem;}
.lunar-practice-card{background:rgba(0,0,0,.3);border-radius:16px;padding:2rem;
    border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:all .3s;position:relative;overflow:hidden;}
.lunar-practice-card:hover{transform:translateY(-5px);border-color:rgba(139,122,255,.5);
    background:rgba(139,122,255,.1);box-shadow:0 10px 30px rgba(139,122,255,.2);}
.lunar-practice-card:focus{outline:2px solid rgba(139,122,255,.6);outline-offset:2px;}
.lunar-practice-card.locked{opacity:.6;cursor:default;}
.lunar-practice-card.locked:hover{transform:none;border-color:rgba(255,255,255,.1);background:rgba(0,0,0,.3);box-shadow:none;}
.lunar-practice-icon{font-size:2.5rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;}
.lunar-practice-icon svg{width:40px;height:40px;}
.lunar-practice-info h4{color:#e0e0ff;font-size:1.2rem;margin:0 0 .75rem;font-family:'Cormorant Garamond',serif;}
.lunar-practice-info p{color:rgba(224,224,255,.7);font-size:.95rem;line-height:1.6;margin:0;}
.lunar-lock-badge{position:absolute;top:1rem;right:1rem;background:rgba(34,197,94,.2);color:#22c55e;
    padding:.5rem 1rem;border-radius:20px;font-size:.85rem;font-weight:600;border:1px solid rgba(34,197,94,.3);}

/* ── Saved inputs ────────────────────────────────────────────────────────── */
.lunar-saved-inputs{background:rgba(0,0,0,.3);border-radius:16px;padding:2rem;margin:2rem 0;
    border:1px solid rgba(139,122,255,.3);}
.lunar-saved-inputs h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin:0 0 1.5rem;text-align:center;}
.lunar-saved-item{margin:1.5rem 0;padding:1.5rem;background:rgba(255,255,255,.03);
    border-radius:12px;border-left:3px solid rgba(139,122,255,.5);}
.lunar-saved-label{color:rgba(139,122,255,.8);font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.75rem;}
.lunar-saved-text{color:rgba(224,224,255,.9);font-size:1.1rem;line-height:1.6;font-family:'Cormorant Garamond',serif;}
.lunar-saved-footer{text-align:center;margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);
    color:rgba(224,224,255,.6);font-size:.9rem;font-style:italic;}

/* ── Group circle ────────────────────────────────────────────────────────── */
.lunar-group-intro{background:rgba(0,0,0,.3);border-radius:20px;padding:3rem;text-align:center;margin:2rem 0;border:1px solid rgba(255,255,255,.1);}
.lunar-group-intro h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:2rem;margin:0 0 1rem;}
.lunar-group-intro p{color:rgba(224,224,255,.8);font-size:1.1rem;line-height:1.8;max-width:600px;margin:0 auto 2rem;}
.lunar-live-presence{display:inline-flex;align-items:center;gap:.75rem;padding:.75rem 1.5rem;
    background:rgba(139,122,255,.15);border-radius:50px;border:1px solid rgba(139,122,255,.3);margin:1.5rem 0;}
.lunar-live-presence span{color:rgba(224,224,255,.9);font-size:.95rem;font-weight:500;}
.lunar-group-avatars{display:flex;justify-content:center;margin:2rem 0;}
.lunar-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:600;font-size:1.1rem;border:3px solid rgba(0,0,0,.5);margin-left:-12px;animation:lunar-fade-in .5s ease-out backwards;}
.lunar-avatar:first-child{margin-left:0;}
.lunar-join-avatar{background:rgba(139,122,255,.3);border-color:rgba(139,122,255,.5);cursor:pointer;transition:all .3s;}
.lunar-join-avatar:hover{transform:scale(1.1);background:rgba(139,122,255,.5);}
.lunar-join-circle-btn{margin-top:2rem;padding:1rem 3rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    color:#e0e0ff;font-size:1.05rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    letter-spacing:.05em;cursor:pointer;transition:all .35s;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-join-circle-btn:hover{border-color:rgba(139,122,255,.7);color:#fff;
    box-shadow:0 0 40px rgba(139,122,255,.3),inset 0 0 16px rgba(139,122,255,.12);transform:translateY(-2px);}

/* ── Closure ─────────────────────────────────────────────────────────────── */
.lunar-closure-section{background:rgba(0,0,0,.3);border-radius:16px;padding:2.5rem;margin:3rem 0;border:1px solid rgba(255,255,255,.1);}
.lunar-closure-section h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin:0 0 1rem;text-align:center;}
.lunar-closure-section p{color:rgba(224,224,255,.8);font-size:1.1rem;line-height:1.6;text-align:center;margin-bottom:2rem;}

/* ── Wisdom ──────────────────────────────────────────────────────────────── */
.lunar-wisdom-section{margin:3rem 0;}
.lunar-wisdom-text{background:linear-gradient(135deg,rgba(139,122,255,.15),rgba(107,95,216,.15));
    border-left:4px solid rgba(139,122,255,.6);padding:2rem 2.5rem;border-radius:12px;
    color:rgba(224,224,255,.9);font-size:1.3rem;font-style:italic;font-family:'Cormorant Garamond',serif;
    line-height:1.8;text-align:center;}

/* ── Popup ───────────────────────────────────────────────────────────────── */
.lunar-practice-popup{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);
    z-index:999999;display:flex;align-items:center;justify-content:center;padding:2rem;animation:lunar-fade-in .3s ease-out;}
.lunar-popup-content{background:linear-gradient(135deg,rgba(26,26,46,.95),rgba(15,15,30,.95));
    border-radius:24px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;
    border:1px solid rgba(139,122,255,.3);box-shadow:0 20px 60px rgba(0,0,0,.5);
    animation:lunar-fade-in-up .4s ease-out;position:relative;}
.lunar-popup-close{position:absolute;top:1.5rem;right:1.5rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    width:auto;height:auto;padding:.35rem 1rem;
    display:flex;align-items:center;justify-content:center;
    color:#e0e0ff;font-size:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    cursor:pointer;transition:all .35s;z-index:10;
    box-shadow:0 0 16px rgba(139,122,255,.15),inset 0 0 8px rgba(139,122,255,.08);}
.lunar-popup-close:hover{border-color:rgba(139,122,255,.7);color:#fff;transform:translateY(-1px);
    box-shadow:0 0 28px rgba(139,122,255,.3),inset 0 0 12px rgba(139,122,255,.12);}
.lunar-popup-header{padding:2.5rem;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:1.5rem;}
.lunar-popup-icon{font-size:3rem;flex-shrink:0;}
.lunar-popup-icon svg{width:48px;height:48px;color:#8B7AFF;}
.lunar-popup-title h2{margin:0;color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.8rem;}
.lunar-popup-subtitle{margin:.5rem 0 0;color:rgba(224,224,255,.7);font-size:1rem;}
.lunar-popup-body{padding:2.5rem;}
.lunar-popup-section{margin-bottom:2rem;}
.lunar-popup-section:last-child{margin-bottom:0;}
.lunar-popup-section h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin:0 0 1rem;}
.lunar-popup-section h4{color:#e0e0ff;font-size:1.2rem;margin:0 0 .75rem;}
.lunar-popup-section p{color:rgba(224,224,255,.8);line-height:1.8;margin:.75rem 0;}
.lunar-popup-section ul,.lunar-popup-section ol{color:rgba(224,224,255,.8);line-height:2;padding-left:1.5rem;margin:1rem 0;}
.lunar-popup-section li{margin:.5rem 0;font-size:1.05rem;}
.lunar-popup-highlight{background:rgba(139,122,255,.15);border-left:3px solid rgba(139,122,255,.6);
    padding:1rem 1.5rem;border-radius:8px;margin:1.5rem 0;}
.lunar-popup-highlight p{margin:0;font-style:italic;color:rgba(224,224,255,.9);}
.lunar-popup-footer{margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);}

/* ── Buttons ─────────────────────────────────────────────────────────────── */
.lunar-popup-btn{width:100%;padding:1rem 1.5rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    color:#e0e0ff;font-size:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    letter-spacing:.05em;cursor:pointer;transition:all .35s;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-popup-btn:hover{border-color:rgba(139,122,255,.7);color:#fff;transform:translateY(-2px);
    box-shadow:0 0 40px rgba(139,122,255,.3),inset 0 0 16px rgba(139,122,255,.12);}
.lunar-popup-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none;}
.lunar-btn-secondary{
    background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.15);color:rgba(224,224,255,.6);
    box-shadow:none;margin-top:.75rem;}
.lunar-btn-secondary:hover{border-color:rgba(255,255,255,.3);color:#e0e0ff;
    background:linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.06));
    box-shadow:none;transform:translateY(-1px);}
.lunar-btn-success{
    background:linear-gradient(135deg,rgba(113,255,170,.25),rgba(95,216,158,.35));
    border:1px solid rgba(113,255,170,.45);color:#a0ffd0;
    box-shadow:0 0 24px rgba(113,255,170,.1),inset 0 0 12px rgba(113,255,170,.06);}
.lunar-btn-success:hover{border-color:rgba(113,255,170,.7);color:#d0fff0;transform:translateY(-2px);
    box-shadow:0 0 40px rgba(113,255,170,.25),inset 0 0 16px rgba(113,255,170,.1);}

/* ── Forms ───────────────────────────────────────────────────────────────── */
.lunar-textarea-large{width:100%;min-height:150px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;padding:1.5rem;color:#e0e0ff;font-family:inherit;font-size:1.1rem;
    line-height:1.6;margin:1.5rem 0;resize:vertical;transition:border-color .3s;box-sizing:border-box;}
.lunar-textarea-large:focus{outline:none;border-color:rgba(139,122,255,.5);}
.lunar-helper-text{font-size:.9rem;color:rgba(224,224,255,.6);margin-top:.5rem;}
.lunar-affirmation-grid{display:grid;gap:.5rem;margin:1rem 0;}
.lunar-affirmation-btn{padding:.65rem 1.25rem;
    background:linear-gradient(135deg,rgba(139,122,255,.18),rgba(107,95,216,.15));
    border:1px solid rgba(139,122,255,.35);border-radius:50px;
    color:rgba(224,224,255,.75);cursor:pointer;text-align:center;
    font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;letter-spacing:.03em;
    transition:all .35s;width:100%;
    box-shadow:0 0 12px rgba(139,122,255,.08),inset 0 0 6px rgba(139,122,255,.04);}
.lunar-affirmation-btn:hover{background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border-color:rgba(139,122,255,.6);color:#e0e0ff;
    box-shadow:0 0 24px rgba(139,122,255,.2),inset 0 0 10px rgba(139,122,255,.08);transform:translateY(-1px);}
.lunar-intention-preview{background:rgba(139,122,255,.1);border-radius:12px;padding:1.5rem;margin:1.5rem 0;}
.lunar-preview-label{font-style:italic;color:rgba(224,224,255,.6);font-size:.9rem;margin-bottom:1rem;}
.lunar-word-input{width:100%;padding:1.5rem;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;color:#e0e0ff;font-size:1.5rem;text-align:center;font-family:'Cormorant Garamond',serif;
    margin:1.5rem 0;transition:border-color .3s;box-sizing:border-box;}
.lunar-word-input:focus{outline:none;border-color:rgba(139,122,255,.5);}

/* ── Timers ──────────────────────────────────────────────────────────────── */
.lunar-timer-display{font-size:4rem;color:#8B7AFF;font-family:'Cormorant Garamond',serif;margin:2rem 0;}
.lunar-timer-small{font-size:2rem;color:#8B7AFF;font-family:'Cormorant Garamond',serif;margin:1rem 0;}

/* ── Word cloud ──────────────────────────────────────────────────────────── */
.lunar-word-cloud{background:rgba(0,0,0,.3);border-radius:16px;padding:3rem;min-height:300px;
    display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;margin:2rem 0;}
.lunar-word-cloud-item{font-family:'Cormorant Garamond',serif;opacity:.8;font-weight:500;
    animation:lunar-fade-in-scale .6s ease-out backwards;}
.lunar-word-count{color:rgba(224,224,255,.6);font-size:.9rem;margin:2rem 0;}
.lunar-witness-title{color:#e0e0ff;font-family:'Cormorant Garamond',serif;margin-bottom:1rem;}

/* ── Admin panel ─────────────────────────────────────────────────────────── */
.lunar-admin-wrapper{margin-top:24px;border-radius:var(--radius-lg,12px);border:2px dashed var(--neuro-accent-a30);overflow:hidden;}
.lunar-admin-header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;
    cursor:pointer;background:var(--neuro-bg-lighter);user-select:none;}
.lunar-admin-header span:first-child{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;}
.lunar-admin-body{padding:16px 20px;background:var(--neuro-bg-lighter);border-top:1px solid var(--neuro-accent-a10);}
.lunar-admin-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;}
.lunar-admin-room-btn{padding:12px;background:var(--season-mood);border:1px solid var(--border);
    border-radius:var(--radius-md,8px);cursor:pointer;text-align:left;transition:background .2s;width:100%;}
.lunar-admin-room-btn:hover{background:var(--border);}

/* ── Animations ──────────────────────────────────────────────────────────── */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
@keyframes lunar-fade-in{from{opacity:0}to{opacity:1}}
@keyframes lunar-fade-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes lunar-fade-in-scale{from{opacity:0;transform:scale(.8)}to{opacity:.8;transform:scale(1)}}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media(max-width:768px){
    .lunar-top-bar{flex-wrap:wrap;flex-direction:row;align-items:center;padding:1rem;gap:.75rem;}
    .lunar-phase-left{flex:1;gap:1rem;min-width:0;}
    .lunar-moon-icon-large{font-size:2rem;flex-shrink:0;}
    .lunar-phase-info{min-width:0;}
    .lunar-phase-info h2{font-size:1.1rem;}
    .lunar-phase-info p{font-size:.85rem;}
    .lunar-back-hub-btn{position:static;flex-shrink:0;order:1;padding:.5rem 1rem;font-size:.85rem;}
    .lunar-live-count-top{order:2;width:100%;box-sizing:border-box;justify-content:center;}
    .lunar-live-count-top span{font-size:.85rem;}
    .lunar-wisdom-text{font-size:1.2rem;padding:1.5rem;}
    .lunar-practices-grid{grid-template-columns:1fr;}
    .lunar-timer-display{font-size:3rem;}
    .lunar-mode-toggle{flex-direction:column;padding:.25rem;}
    .lunar-mode-btn{width:100%;justify-content:center;padding:.6rem 1rem;}
}

/* ── Accessibility ───────────────────────────────────────────────────────── */
.lunar-practice-card:focus,.lunar-popup-btn:focus,.lunar-mode-btn:focus,.lunar-back-hub-btn:focus{
    outline:1px solid rgba(139,122,255,.5);outline-offset:3px;}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}}
        `}},Le=()=>window.CommunityDB,Ot={location:{latitude:31,longitude:0,name:"Default"},currentMoonData:null,currentLunarRoom:null,lunarRooms:[{phaseRanges:[[0,.068],[.932,1]],phaseName:"New Moon",icon:"🌑",roomName:"New Moon Intentions",description:"Set intentions and plant seeds for the lunar cycle",roomId:"new-moon",energy:"Beginning, Stillness, Potential",practices:["Silent meditation","Intention setting","Vision journaling","Seed planting ritual"]},{phaseRanges:[[.068,.432]],phaseName:"Waxing Moon",icon:"🌓",roomName:"Waxing Growth Practice",description:"Build momentum and cultivate expanding energy",roomId:"waxing-moon",energy:"Growth, Action, Building",practices:["Dynamic movement","Energy cultivation","Goal visualization","Action planning meditation"]},{phaseRanges:[[.432,.568]],phaseName:"Full Moon",icon:"🌕",roomName:"Full Moon Illumination",description:"Celebrate fullness and release what no longer serves",roomId:"full-moon",energy:"Culmination, Release, Clarity",practices:["Celebration ritual","Gratitude meditation","Release ceremony","Moon bathing"]},{phaseRanges:[[.568,.932]],phaseName:"Waning Moon",icon:"🌗",roomName:"Waning Release Practice",description:"Let go and reflect on the lunar journey",roomId:"waning-moon",energy:"Release, Reflection, Rest",practices:["Reflection meditation","Letting go ritual","Rest and restore","Completion ceremony"]}],init(){if(this._initialized)return;this._initialized=!0;const t=()=>this.updateAll();navigator.geolocation?navigator.geolocation.getCurrentPosition(({coords:e})=>{this.location={latitude:e.latitude,longitude:e.longitude,name:"Your Location"},t()},()=>t(),{timeout:5e3,maximumAge:36e5}):t(),setInterval(()=>this.updateAll(),6e5)},updateAll(){this.updateMoonData(),this.updateMoonVisualization(),this.updateLunarRoom(),this.renderLunarCard()},setLocation(t,e,i){this.location={latitude:t,longitude:e,name:i},this.updateAll()},updateMoonData(){const t=new Date,e=ve.getMoonIllumination(t),i=ve.getMoonTimes(t,this.location.latitude,this.location.longitude);this.currentMoonData={phase:e.phase,fraction:e.fraction,angle:e.angle,rise:i.rise,set:i.set,phaseName:this.getMoonPhaseName(e.phase),age:e.phase*29.53,nextFullMoon:this.getNextFullMoon(t)},this._renderMoonInfo()},_renderMoonInfo(){const t=this.currentMoonData;if(!t)return;const e=(o,n)=>{const r=document.getElementById(o);r&&(r.textContent=n)};e("moonPhaseName",t.phaseName),e("moonIllumination",`${Math.round(t.fraction*100)}% illuminated`),e("moonAge",`${t.age.toFixed(1)} days old`),e("moonrise",t.rise?this.formatTime(t.rise):"No rise today"),e("moonset",t.set?this.formatTime(t.set):"No set today");const i=Math.ceil((t.nextFullMoon-new Date)/864e5);e("nextPhase",`Next Full Moon: ${this.formatDate(t.nextFullMoon)} (${i} days)`)},updateMoonVisualization(){this.currentMoonData&&this.drawMoon(this.currentMoonData.phase,this.currentMoonData.angle)},drawMoon(t,e){const i=document.getElementById("moonSvg");if(!i)return;const o=50,n=60,r=60;i.innerHTML="";const a=document.createElementNS("http://www.w3.org/2000/svg","g");a.setAttribute("transform",`rotate(${(e*180/Math.PI*-1).toFixed(2)}, ${n}, ${r})`),i.appendChild(a);const s=document.createElementNS("http://www.w3.org/2000/svg","circle");s.setAttribute("cx",n),s.setAttribute("cy",r),s.setAttribute("r",o),s.setAttribute("fill","#2d3748"),a.appendChild(s);const l=Math.cos(t*2*Math.PI)*o,d=document.createElementNS("http://www.w3.org/2000/svg","path");d.setAttribute("fill","#f7fafc"),d.setAttribute("d",t<.5?`M ${n},${r-o} A ${o},${o} 0 0 1 ${n},${r+o} Q ${n+l},${r} ${n},${r-o}`:`M ${n},${r-o} Q ${n+l},${r} ${n},${r+o} A ${o},${o} 0 0 1 ${n},${r-o}`),a.appendChild(d),[{x:.3,y:-.2,r:.15},{x:-.2,y:.3,r:.1},{x:.1,y:.4,r:.08}].forEach(({x:c,y:p,r:h})=>{if(!(t<.5&&c>0||t>=.5&&c<0||t>.45&&t<.55))return;const g=document.createElementNS("http://www.w3.org/2000/svg","circle");g.setAttribute("cx",n+c*o),g.setAttribute("cy",r+p*o),g.setAttribute("r",h*o),g.setAttribute("fill","rgba(0,0,0,0.15)"),a.appendChild(g)})},getMoonPhaseName(t){return t<.03||t>.97?"New Moon":t<.22?"Waxing Crescent":t<.28?"First Quarter":t<.47?"Waxing Gibbous":t<.53?"Full Moon":t<.72?"Waning Gibbous":t<.78?"Last Quarter":"Waning Crescent"},getNextFullMoon(t){const e=ve.getMoonIllumination(t).phase,i=e<.5?(.5-e)*29.53:(1.5-e)*29.53;return new Date(t.getTime()+i*864e5)},getLunarRoomByPhase(t){return this.lunarRooms.find(e=>e.phaseRanges.some(([i,o])=>t>=i&&t<=o))??this.lunarRooms[0]},updateLunarRoom(){var e;if(!this.currentMoonData)return;const t=this.getLunarRoomByPhase(this.currentMoonData.phase);(e=this.currentLunarRoom)==null||e.roomId,t.roomId,this.currentLunarRoom=t},getCurrentRoom(){return this.currentLunarRoom},_ROOM_MODULES:{"new-moon":()=>ue(()=>import("./newmoon-room-2vT5MpwJ.js"),__vite__mapDeps([0,1])),"waxing-moon":()=>ue(()=>import("./waxingmoon-room-CbmpEvcf.js"),__vite__mapDeps([2,1])),"full-moon":()=>ue(()=>import("./fullmoon-room-G3y9dbyT.js"),__vite__mapDeps([3,1])),"waning-moon":()=>ue(()=>import("./waningmoon-room-CNNDxKGT.js"),__vite__mapDeps([4,1]))},_roomExportName:{"new-moon":"NewMoonRoom","waxing-moon":"WaxingMoonRoom","full-moon":"FullMoonRoom","waning-moon":"WaningMoonRoom"},async _loadAndEnterRoom(t){var i,o,n;const e=this._ROOM_MODULES[t];if(!e){(i=window.Core)==null||i.showToast(`Unknown room: ${t}`);return}try{const a=(await e())[this._roomExportName[t]];a?a.enterRoom():(o=window.Core)==null||o.showToast(`${t} failed to initialise`)}catch(r){console.error(`[LunarEngine] Failed to load ${t}:`,r),(n=window.Core)==null||n.showToast(`Failed to load ${t}`)}},joinLunarRoom(){var t;if(!this.currentLunarRoom){(t=window.Core)==null||t.showToast("Lunar room not ready");return}this._loadAndEnterRoom(this.currentLunarRoom.roomId)},adminJoinRoom(t){this._loadAndEnterRoom(t)},renderLunarCard(){var n,r,a;const t=document.getElementById("lunarContainer");if(!t){console.warn("LunarEngine: #lunarContainer not found");return}if(Ce.injectStyles(),!this.currentMoonData||!this.currentLunarRoom){t.innerHTML='<p style="color:var(--text-muted);padding:20px;">Loading lunar data...</p>';return}const{currentMoonData:e,currentLunarRoom:i}=this,o=(a=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)==null?void 0:a.is_admin;t.innerHTML=`
            <div class="celestial-card-full lunar-card">
                <div class="celestial-content-horizontal">
                    <div class="celestial-visual-section">
                        <div class="moon-visual">
                            <svg width="120" height="120" viewBox="0 0 120 120" id="moonSvg" aria-hidden="true" focusable="false"></svg>
                        </div>
                    </div>
                    <div class="celestial-info-section">
                        <div class="celestial-info-title">Lunar Phase &amp; Cycles</div>
                        <div class="moon-phase-name" id="moonPhaseName">${e.phaseName}</div>
                        <div class="moon-illumination" id="moonIllumination">${Math.round(e.fraction*100)}% illuminated</div>
                        <div class="moon-age" id="moonAge">${e.age.toFixed(1)} days old</div>
                        <div class="next-phase" id="nextPhase">
                            Next Full Moon: ${this.formatDate(e.nextFullMoon)}
                            (${Math.ceil((e.nextFullMoon-new Date)/864e5)} days)
                        </div>
                    </div>
                    <div class="celestial-times-section">
                        <div class="celestial-time">
                            <span class="time-label">Moonrise</span>
                            <span class="time-value" id="moonrise">${e.rise?this.formatTime(e.rise):"No rise today"}</span>
                        </div>
                        <div class="celestial-time">
                            <span class="time-label">Moonset</span>
                            <span class="time-value" id="moonset">${e.set?this.formatTime(e.set):"No set today"}</span>
                        </div>
                    </div>
                </div>
                ${this._renderRoomSection(i)}
                ${o?this._renderAdminSection():""}
            </div>`,this.updateMoonVisualization(),this._refreshOuterCard()},_renderRoomSection(t){return`
            <div class="celestial-practice-room" data-room-type="lunar" id="lunarPracticeRoom">
                <div class="room-divider"></div>
                <div class="room-content-inline">
                    <div class="room-header-inline">
                        <div class="room-icon-inline" id="lunarRoomIcon">${t.icon}</div>
                        <div class="room-info-inline">
                            <div class="room-name-inline" id="lunarRoomName">${t.roomName}</div>
                            <div class="room-desc-inline" id="lunarRoomDesc">${t.description}</div>
                        </div>
                    </div>
                    <div class="room-meta-inline">
                        <div class="room-energy">
                            <div class="energy-pulse" style="background:var(--ring-silent);"></div>
                            <span id="lunarRoomPresence">0 present</span>
                        </div>
                        <button type="button" class="btn btn-primary join-btn-inline" data-action="join-lunar-room">Join Space</button>
                    </div>
                </div>
            </div>`},_attachCardListeners(){const t=document.querySelector('[data-action="join-lunar-room"]');t&&!t._lunarBound&&(t.addEventListener("click",()=>this.joinLunarRoom()),t._lunarBound=!0)},_renderAdminSection(){const t="lunarAdminPanel",e="lunarAdminToggle",i=new Set,n=this.lunarRooms.filter(r=>i.has(r.roomId)?!1:i.add(r.roomId)).map(r=>`
            <button type="button" class="lunar-admin-room-btn" data-room-id="${r.roomId}">
                <div style="font-size:24px;margin-bottom:4px;">${r.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${r.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${r.phaseName}</div>
            </button>`).join("");return`
            <div class="lunar-admin-wrapper">
                <div class="lunar-admin-header" role="button" tabindex="0" aria-expanded="false" data-panel="${t}" data-toggle="${e}">
                    <span style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN: Enter Any Lunar Room</span>
                    <span id="${e}">▶</span>
                </div>
                <div id="${t}" class="lunar-admin-body" style="display:none;">
                    <div class="lunar-admin-grid">${n}</div>
                </div>
            </div>`},_attachAdminListeners(){const t=document.querySelector(".lunar-admin-header");if(t&&!t._lunarBound){const e=()=>{const i=document.getElementById(t.dataset.panel),o=document.getElementById(t.dataset.toggle),n=i.style.display!=="none";i.style.display=n?"none":"block",o.textContent=n?"▶":"▼",t.setAttribute("aria-expanded",String(!n))};t.addEventListener("click",e),t.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),e())}),t._lunarBound=!0}document.querySelectorAll(".lunar-admin-room-btn").forEach(e=>{e._lunarBound||(e.addEventListener("click",()=>this.adminJoinRoom(e.dataset.roomId)),e._lunarBound=!0)})},_refreshOuterCard(){var i,o,n;if(!((i=Le())!=null&&i.ready)){this._outerCardRetry||(this._outerCardRetry=setTimeout(()=>{this._outerCardRetry=null,this._refreshOuterCard()},500));return}const t=(o=this.currentLunarRoom)==null?void 0:o.roomId;if(!t)return;const e=async()=>{var r;try{const a=await((r=Le())==null?void 0:r.getRoomParticipants(t)),s=document.getElementById("lunarRoomPresence");s&&(s.textContent=`${a.length} present`)}catch(a){console.warn("[LunarEngine] _refreshOuterCard error:",a)}};if(e(),this._attachCardListeners(),this._attachAdminListeners(),this._outerCardSub)try{this._outerCardSub.unsubscribe()}catch{}this._outerCardSub=(n=Le())==null?void 0:n.subscribeToPresence(e)},formatTime(t){return!t||isNaN(t.getTime())?"N/A":t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})},formatDate(t){return t.toLocaleDateString("en-US",{month:"short",day:"numeric"})},getMoonData(){return this.currentMoonData},renderLunarRoom(){this.renderLunarCard()},injectAdminUI(){var i,o,n;if(!((n=(o=(i=window.Core)==null?void 0:i.state)==null?void 0:o.currentUser)==null?void 0:n.is_admin))return;const e=document.querySelector("#lunarContainer .celestial-card-full");if(e&&!document.getElementById("lunarAdminPanel")){const r=document.createElement("div");r.innerHTML=this._renderAdminSection(),e.appendChild(r.firstElementChild),this._attachAdminListeners()}}};window.LunarEngine=Ot;class xe extends L{constructor(e){super(e),this.initPlayerState(),this.initCycleState(),this.sessions=[],this.scheduleModalTitle="📅 Upcoming Sessions",this.state.currentSession=null,this.state.nextSession=null}onInit(){this.initializeCycle(),this.preloadYouTubeAPI()}onEnter(){this.loadYouTubeAPI()}onCleanup(){this.cleanupPlayer(),this.cleanupCycle()}setSessions(e){const i=Math.floor(e/(this.config.cycleDuration*1e3))%this.sessions.length;this.state.currentSession=this.sessions[i],this.state.nextSession=this.sessions[(i+1)%this.sessions.length]}getCurrentSession(){return this.state.currentSession}getNextSession(){return this.state.nextSession}buildBody(){const e=this.getCurrentSession();return`
        <div class="ps-body">
            <main class="ps-main">
                <h2 style="text-align:center;margin:20px 0;font-size:24px;font-weight:600;color:var(--text);"
                    id="${this.roomId}SessionHeading" aria-live="polite">
                    Current Session - ${(e==null?void 0:e.title)||"Loading…"}
                </h2>
                ${this.buildPlayerContainer()}
                ${this.buildPlayerControls()}
            </main>
        </div>`}buildHubModals(){return this._buildScheduleModalShell()}_buildScheduleModalShell(){return`
        <div class="modal-overlay" id="${this.roomId}ScheduleModal" role="dialog" aria-modal="true" aria-labelledby="${this.roomId}ScheduleTitle">
            <div class="modal-card schedule-modal">
                <button type="button" class="modal-close" aria-label="Close schedule modal" data-action="closeScheduleModal">×</button>
                <h2 id="${this.roomId}ScheduleTitle">${this.scheduleModalTitle}</h2>
                <div class="schedule-content" id="${this.roomId}ScheduleContent"></div>
            </div>
        </div>`}showScheduleModal(){const e=document.getElementById(`${this.roomId}ScheduleModal`),i=document.getElementById(`${this.roomId}ScheduleContent`);if(!e||!i)return;const o=Date.now(),n=this.config.cycleDuration*1e3,r=this.config.openDuration*1e3,a=Math.floor(o/n),s=Array.from({length:6},(l,d)=>this._buildScheduleRow(o,n,r,a+d,d===0)).join("");i.innerHTML=`<div class="schedule-list">${s}</div>`,e.classList.add("active")}_buildScheduleRow(e,i,o,n,r){const a=n*i,s=a+o,l=this.sessions[n%this.sessions.length],d=e-a,c=r&&d>=0&&d<o,p=r&&d>=o,h=f=>new Date(f).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),m=c?'<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>':p?'<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>':"";return`
        <div class="schedule-item${r?" current":""}"
             style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:var(--radius-md);margin-bottom:8px;${c?"background:var(--accent);color:white;":"background:var(--surface);"}">
            <div style="display:flex;align-items:center;gap:12px;flex:1;">
                <span style="font-size:24px;">${l.emoji}</span>
                <div>
                    <div style="font-weight:600;font-size:14px;">${l.title}${m}</div>
                    <div style="font-size:11px;opacity:0.7;">${[l.category,l.duration].filter(Boolean).join(" · ")}</div>
                </div>
            </div>
            <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
                <div style="font-weight:600;">${h(a)}</div>
                <div style="opacity:0.6;">closes ${h(s)}</div>
            </div>
        </div>`}closeScheduleModal(){var e;(e=document.getElementById(`${this.roomId}ScheduleModal`))==null||e.classList.remove("active")}}Object.assign(xe.prototype,At);Object.assign(xe.prototype,Bt);const ct={switchTab(t){const e=document.getElementById(`${this.roomId}DailyTab`),i=document.getElementById(`${this.roomId}PersonalTab`),o=document.getElementById(`${this.roomId}TabDaily`),n=document.getElementById(`${this.roomId}TabPersonal`);if(!e||!i||!o||!n)return;const r=t==="daily";e.style.display=r?"block":"none",i.style.display=r?"none":"block",o.setAttribute("aria-selected",String(r)),n.setAttribute("aria-selected",String(!r)),this._styleTab(o,r),this._styleTab(n,!r),this.state.currentTab=t,t==="personal"&&typeof this.onPersonalTabEnter=="function"&&this.onPersonalTabEnter()},_styleTab(t,e){t.style.background=e?"linear-gradient(135deg,var(--neuro-accent) 0%,var(--neuro-accent-light) 100%)":"transparent",t.style.color=e?"white":"var(--text)",t.style.borderBottom=e?"3px solid var(--neuro-accent)":"3px solid transparent"},buildTabNav(t,e){return`
        <div role="tablist" style="display:flex;gap:8px;margin-bottom:24px;border-bottom:2px solid var(--border);flex-wrap:wrap;">
            <button type="button" id="${this.roomId}TabDaily"
                    data-action="switchTab" data-tab="daily"
                    role="tab" aria-selected="true" aria-controls="${this.roomId}DailyTab"
                    style="padding:10px 16px;background:linear-gradient(135deg,var(--neuro-accent) 0%,var(--neuro-accent-light) 100%);color:white;border:none;border-bottom:3px solid var(--neuro-accent);cursor:pointer;font-weight:600;font-size:14px;border-radius:8px 8px 0 0;white-space:nowrap;">
                ${t}
            </button>
            <button type="button" id="${this.roomId}TabPersonal"
                    data-action="switchTab" data-tab="personal"
                    role="tab" aria-selected="false" aria-controls="${this.roomId}PersonalTab"
                    style="padding:10px 16px;background:transparent;color:var(--text);border:none;border-bottom:3px solid transparent;cursor:pointer;font-weight:600;font-size:14px;border-radius:8px 8px 0 0;white-space:nowrap;">
                ${e}
            </button>
        </div>`}},Nt={storage:{_key:t=>`${be.STORAGE_PREFIX}${t}${be.STORAGE_KEY_SUFFIX}`,get(t){const e=localStorage.getItem(this._key(t));if(!e)return null;try{return JSON.parse(e)}catch(i){return console.error(`[SolarUI] Error loading ${t} data:`,i),null}},set(t,e){try{return localStorage.setItem(this._key(t),JSON.stringify(e)),!0}catch(i){return console.error(`[SolarUI] Error saving ${t} data:`,i),!1}},clear(t){localStorage.removeItem(this._key(t))}},utils:{calculateDaysRemaining:t=>Math.ceil((t-new Date)/864e5),generateFloatingElements(t,e=be.FLOATING_ELEMENT_COUNT){const{FLOATING_ELEMENT_DELAY_MAX:i,FLOATING_ELEMENT_DURATION_MIN:o,FLOATING_ELEMENT_DURATION_RANGE:n}=be;let r="";for(let a=0;a<e;a++){const s=t[Math.floor(Math.random()*t.length)],l=(Math.random()*100).toFixed(2),d=(Math.random()*i).toFixed(2),c=(o+Math.random()*n).toFixed(2);r+=`<div class="solar-floating-element"
                      style="left:${l}%;animation-delay:${d}s;animation-duration:${c}s;">
                   ${s}
                 </div>`}return r},formatDate:t=>t.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})},renderers:{topBar({seasonName:t,emoji:e,daysText:i,livingPresenceCount:o}){return`
        <div class="solar-top-bar">
          <div class="solar-phase-left">
            <div class="solar-sun-icon">${e}</div>
            <div class="solar-phase-info">
              <h2>${t} Season</h2>
              <p>${i}</p>
            </div>
          </div>
          <div class="solar-live-count-top">
            <div class="solar-pulse-dot"></div>
            <span id="solarLiveCountTop">${o} members practicing with you now</span>
          </div>
          <button type="button" onclick="SolarUIManager.handleBackToHub()" class="solar-back-hub-btn" aria-label="Leave practice and return to hub">
            Gently Leave
          </button>
        </div>`},modeToggle(){const t=i=>i==="solo"?'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>':'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',e=(i,o,n)=>`<button type="button" class="solar-mode-btn${n?" active":""}" data-mode="${i}" aria-pressed="${n}">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${t(i)}</svg>
           <span>${o}</span>
         </button>`;return`<div class="solar-mode-toggle">${e("solo","Solo Practice",!0)}${e("group","Group Circle",!1)}</div>`},practiceCard(t,e){return`
        <div class="solar-practice-card" data-practice="${t.id}" data-locked="${e}" tabindex="0" role="button" aria-label="${t.title}${e?" - Complete":""}" style="cursor:pointer;">
          ${e?'<div class="solar-lock-icon">✓</div>':""}
          <div class="solar-practice-icon" style="background:${t.color};">${t.icon}</div>
          <h4 class="solar-practice-title">${t.title}</h4>
          <p class="solar-practice-desc">${t.description}</p>
        </div>`},savedInputs(t,e){const{intention:i,affirmation:o,releaseList:n}=t;if(!i&&!o&&!n)return"";const r=s=>Ht.escapeHtml(s),a=(s,l,d)=>`<div class="solar-input-display" style="margin-bottom:1rem;">
           <h4>${s}</h4>
           <p${d?' style="white-space:pre-line;"':""}>${r(l)}</p>
         </div>`;return`
        <div class="solar-saved-inputs">
          <h3>Your ${e} Harvest</h3>
          ${i?a("Season Intention",i,!1):""}
          ${o?a("Gratitude Affirmation",o,!1):""}
          ${n?a("Release/Growth List",n,!0):""}
          <p>Gathered with gratitude as the season completes</p>
        </div>`},groupPractice({seasonEmoji:t,seasonName:e,presenceCount:i,itemEmoji:o,collectiveFocus:n,collectiveNoun:r}){const a=e.toLowerCase();return`
        <div class="solar-group-container">
          <div class="solar-group-emoji">${t}</div>
          <h3 class="solar-group-title">Synchronized ${e} Gathering</h3>
          <p class="solar-group-desc">
            Join fellow practitioners in a collective practice for ${n||"seasonal alignment"}.
            Share intentions and witness the ${r||"energy"} of the season together.
          </p>
          <div class="solar-live-badge">
            <div class="solar-pulse-dot"></div>
            <span id="solarGroupPresenceBadge">${i} gathering now</span>
          </div>
          <div id="solarGroupAvatars" style="display:flex;gap:6px;justify-content:center;margin:1rem 0;flex-wrap:wrap;"></div>
          <h4 style="color:var(--season-accent);margin:2rem 0 1rem 0;">Group Practice Includes:</h4>
          <ul class="solar-group-list">
            <li><span>${o}</span> Join <span id="solarGroupJoinCount">${i}</span> practitioners in live circle</li>
            <li><span>${o}</span> 3-minute guided meditation for seasonal centering</li>
            <li><span>${o}</span> Set a private intention for ${a}</li>
            <li><span>${o}</span> Share one word with the collective field</li>
            <li><span>${o}</span> Witness the circle's ${r||"intentions"}</li>
            <li><span>${o}</span> 2-minute silent integration practice</li>
          </ul>
          <button type="button" class="solar-btn-primary" onclick="window.currentSolarRoom.showCollectiveIntentionPopup()">
            Join ${e} Circle
          </button>
          <p class="solar-group-note">Practice available throughout the ${a} season</p>
        </div>`},closureSection({title:t,intro:e,placeholder:i,buttonText:o,closingLine:n}){return`
        <div class="solar-closure">
          <h3>${t}</h3>
          <p>${e}</p>
          <label for="closureReflection" class="sr-only">${t}</label>
          <textarea id="closureReflection" class="solar-textarea" placeholder="${i}" aria-label="${i}"></textarea>
          ${n?`
            <div class="solar-popup-highlight" style="margin-top:1rem;">
              <p><em>"${n}"</em></p>
            </div>`:""}
          <button type="button" data-action="submit-closure" class="solar-btn-secondary" style="margin-top:1.5rem;">
            ${o}
          </button>
        </div>`},popup({title:t,content:e,hasSaveButton:i}){return`
        <div class="solar-popup-overlay" data-action="close-popup" role="dialog" aria-modal="true">
          <div class="solar-popup-content" onclick="event.stopPropagation()">
            <div class="solar-popup-header">
              <h2>${t}</h2>
              <button type="button" class="solar-popup-close" data-action="close-popup" aria-label="Close practice">close</button>
            </div>
            <div class="solar-popup-body">${e}</div>
            <div class="solar-popup-footer">${i?'<button class="solar-popup-btn" data-action="save-practice">Save Practice</button>':'<button class="solar-popup-btn" data-action="close-popup">Complete</button>'}</div>
          </div>
        </div>`},inactiveRoom({seasonName:t,emoji:e,startDate:i,daysUntil:o}){return`
        <div class="solar-inactive">
          <div class="solar-inactive-container">
            <div class="solar-inactive-header">
              <div class="solar-inactive-sun"><div class="solar-sun-sphere" style="width:120px;height:120px;"></div></div>
              <h1 class="solar-inactive-title">${e} ${t} Solar Room</h1>
              <p class="solar-inactive-subtitle">Harvest &amp; Gratitude Practice Space</p>
            </div>
            <div class="solar-inactive-card">
              <h2>Season Not Yet Active</h2>
              <p>The ${t} Solar Room opens on <strong>${i}</strong></p>
              <p class="solar-inactive-days">${o} days until the ${t.toLowerCase()} season begins</p>
              <p class="solar-inactive-note">Return when the cycle turns and the season is ready.</p>
            </div>
          </div>
        </div>`}},switchMode(t){document.querySelectorAll(".solar-mode-btn").forEach(o=>{const n=o.dataset.mode===t;o.classList.toggle("active",n),o.setAttribute("aria-pressed",String(n))});const e=document.getElementById("soloContent"),i=document.getElementById("groupContent");e&&(e.style.display=t==="solo"?"block":"none"),i&&(i.style.display=t==="group"?"block":"none")},closePracticePopup(){var t;(t=document.getElementById("practicePopup"))==null||t.remove()},handleBackToHub(){var t,e,i,o,n,r;if((t=window.currentSolarRoom)!=null&&t.leaveRoom){window.currentSolarRoom.leaveRoom();return}(i=(e=window.currentSolarRoom)==null?void 0:e._clearPresence)==null||i.call(e),document.body.classList.remove("solar-room-active"),(n=(o=window.Rituals)==null?void 0:o.showClosing)!=null&&n.call(o)||((r=w==null?void 0:w.navigateTo)==null||r.call(w,"hubView"))},showToast(t){var e,i;w!=null&&w.showToast?w.showToast(t):(i=(e=window.app)==null?void 0:e.showToast)==null||i.call(e,t)},_stylesInjected:!1,injectStyles(){if(this._stylesInjected||document.getElementById("solar-shared-styles")){this._stylesInjected=!0;return}const t=document.createElement("style");t.id="solar-shared-styles",t.textContent=this._getSharedCSS(),document.head.appendChild(t),this._stylesInjected=!0},_getSharedCSS(){return`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

/* ── Solar CSS variables ─────────────────────────────────────────────────── */
:root {
  --solar-bg-dark: rgba(0,0,0,0.3);
  --solar-bg-darker: rgba(0,0,0,0.2);
  --solar-text-primary: rgba(224,224,255,0.9);
  --solar-text-secondary: rgba(224,224,255,0.7);
  --solar-text-muted: rgba(224,224,255,0.5);
  --solar-border-light: rgba(255,255,255,0.1);
  --solar-border-medium: rgba(255,255,255,0.15);
  --solar-border-accent: rgba(212,165,116,0.3);
  --solar-glow-warm: rgba(244,164,96,0.6);
  --solar-glow-soft: rgba(212,165,116,0.4);
  --solar-success: #4ade80;
  /* Season defaults (Autumn) — overridden per season */
  --season-accent: #d4a574;
  --season-accent-light: #f4a460;
  --season-accent-dark: #a67c52;
  --season-bg-start: #3a1f0f;
  --season-bg-mid1: #5a3520;
  --season-bg-mid2: #4a2615;
  --season-bg-mid3: #6a4530;
  --season-bg-end: #3a1f0f;
  --season-sun-glow: rgba(212,165,116,0.4);
}

/* ── Season theme variables ──────────────────────────────────────────────── */
body.solar-room-active[data-season="winter"] {
  --season-accent: #a0b8c8; --season-accent-light: #c0d4e4; --season-accent-dark: #7a8c9c;
  --season-bg-start: #1a2a3a; --season-bg-mid1: #2d4050; --season-bg-mid2: #1e3545;
  --season-bg-mid3: #2f4a5a; --season-bg-end: #1a2a3a; --season-sun-glow: rgba(160,184,200,0.4);
}
body.solar-room-active[data-season="spring"] {
  --season-accent: #ffd740; --season-accent-light: #ffe066; --season-accent-dark: #f4c542;
  --season-bg-start: #1a3a2a; --season-bg-mid1: #2d5a3d; --season-bg-mid2: #234a35;
  --season-bg-mid3: #3d6a4d; --season-bg-end: #1a3a2a; --season-sun-glow: rgba(255,215,64,0.4);
}
body.solar-room-active[data-season="summer"] {
  --season-accent: #ff8c42; --season-accent-light: #ffa552; --season-accent-dark: #ff6b35;
  --season-bg-start: #ff6b35; --season-bg-mid1: #ff8c42; --season-bg-mid2: #ffa552;
  --season-bg-mid3: #ffbe68; --season-bg-end: #ff6b35; --season-sun-glow: rgba(255,140,66,0.4);
}
body.solar-room-active[data-season="autumn"] {
  --season-accent: #d4a574; --season-accent-light: #e8b886; --season-accent-dark: #b8835c;
  --season-bg-start: #2a1a0a; --season-bg-mid1: #3d2510; --season-bg-mid2: #2d1c0c;
  --season-bg-mid3: #4a2e15; --season-bg-end: #2a1a0a; --season-sun-glow: rgba(212,165,116,0.4);
}

/* ── Background ──────────────────────────────────────────────────────────── */
body.solar-room-active[data-season] {
  background: linear-gradient(135deg,
    var(--season-bg-start) 0%, var(--season-bg-mid1) 25%,
    var(--season-bg-mid2) 50%, var(--season-bg-mid3) 75%,
    var(--season-bg-end) 100%) !important;
  background-attachment: fixed !important;
}
.solar-room-bg {
  min-height: 100vh; width: 100%;
  background: linear-gradient(135deg,
    var(--season-bg-start) 0%, var(--season-bg-mid1) 25%,
    var(--season-bg-mid2) 50%, var(--season-bg-mid3) 75%,
    var(--season-bg-end) 100%);
  position: relative; overflow-x: hidden;
}

/* ── Floating elements ───────────────────────────────────────────────────── */
.solar-floating-bg{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden;}
.solar-floating-element{position:absolute;font-size:2rem;animation:float linear infinite;opacity:0.6;}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
.solar-word-item:hover{transform:scale(1.2);opacity:1!important;}
@keyframes float{0%{top:-50px;transform:translateX(0) rotate(0deg);opacity:0.6;}100%{top:100vh;transform:translateX(100px) rotate(360deg);opacity:0.3;}}

/* ── Top bar ─────────────────────────────────────────────────────────────── */
.solar-top-bar{position:relative;z-index:10;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:2rem;pointer-events:none;}
.solar-top-bar > *{pointer-events:auto;}
.solar-phase-left{display:flex;align-items:center;gap:1rem;justify-self:start;}
.solar-sun-icon{font-size:3rem;line-height:1;}
.solar-phase-info h2{font-size:1.5rem;color:var(--season-accent);margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.2;}
.solar-phase-info p{font-size:0.9rem;color:rgba(212,165,116,0.7);margin:0.25rem 0 0 0;}
.solar-live-count-top{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.2);border-radius:20px;font-size:0.9rem;color:rgba(212,165,116,0.9);justify-self:center;}
.solar-pulse-dot{width:8px;height:8px;background:var(--solar-success);border-radius:50%;animation:pulse 2s infinite;}
.solar-back-hub-btn{padding:.65rem 1.5rem;background:linear-gradient(135deg,rgba(212,165,116,.18),rgba(166,124,82,.15));border:1px solid rgba(212,165,116,.35);border-radius:50px;color:rgba(212,165,116,.85);cursor:pointer;transition:all .35s;font-size:.88rem;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.04em;justify-self:end;box-shadow:0 0 16px rgba(212,165,116,.1),inset 0 0 8px rgba(212,165,116,.05);}
.solar-back-hub-btn:hover{border-color:rgba(212,165,116,.65);color:var(--season-accent);box-shadow:0 0 28px rgba(212,165,116,.2),inset 0 0 12px rgba(212,165,116,.08);transform:translateY(-1px);}

/* ── Content wrapper ─────────────────────────────────────────────────────── */
.solar-content-wrapper{max-width:900px;margin:0 auto;padding:2rem 2rem 4rem 2rem;position:relative;z-index:2;}

/* ── Sun visual ──────────────────────────────────────────────────────────── */
.solar-sun-visual{display:flex;justify-content:center;margin-bottom:3rem;}
.solar-sun-glow{width:160px;height:160px;display:flex;align-items:center;justify-content:center;}
.solar-sun-sphere{width:100%;height:100%;background:radial-gradient(circle at 35% 35%,var(--season-accent-light) 0%,var(--season-accent) 40%,var(--season-accent-dark) 100%);border-radius:50%;box-shadow:0 0 40px var(--solar-glow-warm),0 0 80px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.3);animation:sunGlow 4s ease-in-out infinite;}
@keyframes sunGlow{0%,100%{box-shadow:0 0 40px var(--solar-glow-warm),0 0 80px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.3);}50%{box-shadow:0 0 50px var(--solar-glow-warm),0 0 100px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.4);}}

/* ── Intro card ──────────────────────────────────────────────────────────── */
.solar-intro-card{background:rgba(212,165,116,0.05);border:1px solid rgba(212,165,116,0.15);border-radius:20px;padding:2rem;margin-bottom:3rem;text-align:center;}
.solar-season-img{width:100%;max-width:500px;height:auto;margin:0 auto 1.5rem;display:block;border-radius:12px;filter:invert(1);}
.solar-intro-card p{color:var(--solar-text-secondary);font-size:1.1rem;line-height:1.7;margin:0;}

/* ── Mode toggle ─────────────────────────────────────────────────────────── */
.solar-mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:2rem;background:rgba(0,0,0,.2);border:1px solid rgba(212,165,116,.1);border-radius:50px;padding:.3rem;}
.solar-mode-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem;background:transparent;border:none;border-radius:50px;color:rgba(212,165,116,.4);cursor:pointer;transition:all .35s;font-size:.9rem;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.03em;}
.solar-mode-btn:hover{color:rgba(212,165,116,.75);}
.solar-mode-btn.active{background:linear-gradient(135deg,rgba(212,165,116,.22),rgba(166,124,82,.2));border:1px solid rgba(212,165,116,.45);color:var(--season-accent);box-shadow:0 0 20px rgba(212,165,116,.12),inset 0 0 10px rgba(212,165,116,.06);}
.solar-mode-btn svg{flex-shrink:0;opacity:.7;}
.solar-mode-btn.active svg{opacity:1;}
.solar-mode-content{animation:fadeIn 0.5s ease-out;}
.solar-mode-description{text-align:center;margin-bottom:2.5rem;}
.solar-mode-description h3{color:var(--season-accent);font-size:1.5rem;margin-bottom:0.5rem;font-family:'Cormorant Garamond',serif;}
.solar-mode-description p{color:var(--solar-text-secondary);margin:0;}

/* ── Practices grid ──────────────────────────────────────────────────────── */
.solar-practices-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin:0 auto 3rem;max-width:800px;}
.solar-practice-card{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:16px;padding:1.5rem;cursor:pointer;transition:all var(--transition-normal);position:relative;}
.solar-practice-card:hover{border-color:var(--season-accent);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,0.2);}
.solar-practice-card.locked{opacity:0.6;cursor:not-allowed;}
.solar-lock-icon{position:absolute;top:1rem;right:1rem;color:var(--solar-success);font-size:1.5rem;}
.solar-practice-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:white;}
.solar-practice-icon svg{width:24px;height:24px;}
.solar-practice-title{color:var(--season-accent);margin-bottom:0.5rem;font-size:1.2rem;font-family:'Cormorant Garamond',serif;}
.solar-practice-desc{color:var(--solar-text-secondary);margin:0;font-size:0.95rem;}

/* ── Saved inputs ────────────────────────────────────────────────────────── */
.solar-saved-inputs{background:rgba(212,165,116,0.05);border:1px solid rgba(212,165,116,0.15);border-radius:16px;padding:2rem;margin-top:2rem;}
.solar-saved-inputs h3{color:var(--season-accent);margin-bottom:1.5rem;font-family:'Cormorant Garamond',serif;text-align:center;}
.solar-input-display{background:var(--solar-bg-dark);border:1px solid var(--solar-border-light);border-radius:12px;padding:1.5rem;}
.solar-input-display h4{color:var(--season-accent);margin-bottom:0.75rem;font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;}
.solar-input-display p{color:var(--solar-text-primary);margin:0;line-height:1.6;}
.solar-saved-inputs > p{text-align:center;color:var(--solar-text-muted);font-size:0.9rem;margin:2rem 0 0 0;font-style:italic;}

/* ── Group practice ──────────────────────────────────────────────────────── */
.solar-group-container{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:20px;padding:2.5rem;text-align:center;}
.solar-group-emoji{font-size:3rem;margin-bottom:1rem;}
.solar-group-title{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;font-size:1.5rem;}
.solar-group-desc{color:var(--solar-text-secondary);margin-bottom:2rem;line-height:1.7;}
.solar-live-badge{display:inline-flex;align-items:center;gap:0.75rem;background:var(--solar-bg-darker);padding:1rem 1.5rem;border-radius:12px;margin-bottom:2rem;}
.solar-live-badge span{color:var(--solar-text-primary);font-weight:500;}
.solar-group-list{text-align:left;color:var(--solar-text-secondary);list-style:none;padding:0;max-width:500px;margin:0 auto 2rem;}
.solar-group-list li{margin-bottom:0.75rem;padding-left:1.5rem;position:relative;}
.solar-group-list li span{position:absolute;left:0;}
.solar-btn-primary{padding:1rem 2.5rem;background:linear-gradient(135deg,rgba(212,165,116,.25),rgba(166,124,82,.3));border:1px solid rgba(212,165,116,.45);border-radius:50px;color:var(--season-accent);font-size:1rem;cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.05em;transition:all .35s;box-shadow:0 0 24px rgba(212,165,116,.12),inset 0 0 12px rgba(212,165,116,.06);}
.solar-btn-primary:hover{border-color:rgba(212,165,116,.7);color:#fff;box-shadow:0 0 40px rgba(212,165,116,.28),inset 0 0 16px rgba(212,165,116,.1);transform:translateY(-2px);}
.solar-group-note{color:var(--solar-text-muted);margin-top:1.5rem;font-size:0.9rem;font-style:italic;}

/* ── Closure ─────────────────────────────────────────────────────────────── */
.solar-closure{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:20px;padding:2rem;margin:3rem 0 2rem;}
.solar-closure h3{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;}
.solar-closure p{color:var(--solar-text-secondary);margin-bottom:1.5rem;}
.solar-textarea{width:100%;min-height:100px;background:var(--solar-bg-dark);border:1px solid var(--solar-border-light);border-radius:12px;padding:1rem;color:var(--solar-text-primary);font-family:inherit;font-size:1rem;line-height:1.6;box-sizing:border-box;resize:vertical;}
.solar-textarea:focus{outline:none;border-color:var(--season-accent);}
.solar-btn-secondary{margin-top:1rem;padding:.75rem 2rem;background:linear-gradient(135deg,rgba(212,165,116,.15),rgba(166,124,82,.2));border:1px solid rgba(212,165,116,.35);border-radius:50px;color:rgba(212,165,116,.8);cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.04em;font-size:.95rem;transition:all .35s;box-shadow:0 0 16px rgba(212,165,116,.08),inset 0 0 8px rgba(212,165,116,.04);}
.solar-btn-secondary:hover{border-color:rgba(212,165,116,.6);color:var(--season-accent);box-shadow:0 0 28px rgba(212,165,116,.2),inset 0 0 12px rgba(212,165,116,.08);transform:translateY(-1px);}

/* ── Popup ───────────────────────────────────────────────────────────────── */
.solar-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999999;padding:2rem;animation:fadeIn 0.3s;}
.solar-popup-content{background:linear-gradient(135deg,#2a1810 0%,#3a2515 100%);border:1px solid rgba(212,165,116,0.3);border-radius:20px;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;animation:slideUp 0.3s;}
.solar-popup-header{padding:2rem 2rem 1rem 2rem;border-bottom:1px solid rgba(212,165,116,0.2);display:flex;justify-content:space-between;align-items:center;}
.solar-popup-header h2{color:var(--season-accent);margin:0;font-family:'Cormorant Garamond',serif;}
.solar-popup-close{background:linear-gradient(135deg,rgba(212,165,116,.18),rgba(166,124,82,.15));
    border:1px solid rgba(212,165,116,.35);border-radius:50px;
    width:auto;height:auto;padding:.35rem 1rem;
    color:rgba(212,165,116,.85);font-size:.88rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    cursor:pointer;line-height:1;transition:all .35s;
    box-shadow:0 0 12px rgba(212,165,116,.1),inset 0 0 6px rgba(212,165,116,.05);}
.solar-popup-close:hover{border-color:rgba(212,165,116,.65);color:var(--season-accent);transform:translateY(-1px);
    box-shadow:0 0 24px rgba(212,165,116,.2),inset 0 0 10px rgba(212,165,116,.08);}
.solar-popup-body{padding:2rem;}
.solar-popup-section{margin-bottom:2rem;}
.solar-popup-section:last-child{margin-bottom:0;}
.solar-popup-section h3{color:var(--season-accent);margin-bottom:1rem;font-size:1.3rem;font-family:'Cormorant Garamond',serif;}
.solar-popup-section p{color:var(--solar-text-secondary);line-height:1.7;margin-bottom:1rem;}
.solar-popup-section ul{color:var(--solar-text-secondary);line-height:1.8;padding-left:1.5rem;margin:0;}
.solar-popup-section li{margin-bottom:0.75rem;}
.solar-popup-highlight{background:var(--neuro-warning-a10);border-left:3px solid var(--season-accent);padding:1rem 1.5rem;border-radius:8px;margin:1.5rem 0;}
.solar-popup-highlight p{color:var(--solar-text-primary);font-style:italic;margin:0;}
.solar-popup-footer{padding:1.5rem 2rem;border-top:1px solid rgba(212,165,116,0.2);text-align:center;}
.solar-popup-btn{padding:.9rem 2rem;background:linear-gradient(135deg,rgba(212,165,116,.25),rgba(166,124,82,.3));border:1px solid rgba(212,165,116,.45);border-radius:50px;color:var(--season-accent);font-size:.95rem;cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.04em;transition:all .35s;box-shadow:0 0 20px rgba(212,165,116,.1),inset 0 0 10px rgba(212,165,116,.05);width:100%;}
.solar-popup-btn:hover{border-color:rgba(212,165,116,.7);color:#fff;box-shadow:0 0 36px rgba(212,165,116,.25),inset 0 0 14px rgba(212,165,116,.08);transform:translateY(-2px);}
.solar-affirmation-btn{display:block;width:100%;padding:.65rem 1.25rem;
    background:linear-gradient(135deg,rgba(212,165,116,.15),rgba(166,124,82,.12));
    border:1px solid rgba(212,165,116,.3);border-radius:50px;
    color:rgba(212,165,116,.75);cursor:pointer;text-align:center;
    font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;letter-spacing:.03em;
    transition:all .35s;margin-bottom:.5rem;
    box-shadow:0 0 10px rgba(212,165,116,.06),inset 0 0 5px rgba(212,165,116,.03);}
.solar-affirmation-btn:hover{background:linear-gradient(135deg,rgba(212,165,116,.25),rgba(166,124,82,.3));
    border-color:rgba(212,165,116,.6);color:var(--season-accent);
    box-shadow:0 0 22px rgba(212,165,116,.18),inset 0 0 10px rgba(212,165,116,.07);transform:translateY(-1px);}

/* ── Inactive room ───────────────────────────────────────────────────────── */
.solar-inactive{min-height:100vh;background:linear-gradient(135deg,#2a1810 0%,#4a2820 100%);padding:2rem;}
.solar-inactive-container{max-width:800px;margin:0 auto;text-align:center;}
.solar-inactive-header{margin-bottom:3rem;}
.solar-inactive-sun{display:inline-block;width:120px;height:120px;position:relative;margin-bottom:1.5rem;}
.solar-inactive-title{font-family:'Cormorant Garamond',serif;font-size:3rem;color:var(--season-accent);margin-bottom:0.5rem;text-shadow:0 2px 10px rgba(212,165,116,0.3);}
.solar-inactive-subtitle{color:rgba(212,165,116,0.7);font-size:1.2rem;}
.solar-inactive-card{background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.3);border-radius:20px;padding:3rem;}
.solar-inactive-card h2{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;}
.solar-inactive-card p{color:var(--solar-text-secondary);font-size:1.1rem;margin-bottom:1.5rem;}
.solar-inactive-days{color:rgba(212,165,116,0.6);font-size:1rem;}
.solar-inactive-note{color:var(--solar-text-muted);margin-top:2rem;font-style:italic;}

/* ── Responsive: tablet (max 1024px) ────────────────────────────────────── */
@media (max-width:1024px) {
  .solar-top-bar{padding:1.25rem 1.5rem !important;grid-template-columns:1fr auto 1fr !important;}
  .solar-content-wrapper{padding:1.5rem 1.5rem 3rem !important;}
  .solar-sun-glow{width:130px !important;height:130px !important;}
  .solar-practices-grid{grid-template-columns:repeat(2,1fr) !important;max-width:100% !important;}
  .solar-popup-content{max-width:640px !important;}
}

/* ── Responsive: mobile (max 768px) ─────────────────────────────────────── */
@media (max-width:768px) {
  /* Top bar: emoji+name left, button right, live count below */
  .solar-top-bar{grid-template-columns:1fr auto !important;grid-template-rows:auto auto !important;padding:0.75rem 1rem !important;gap:0.5rem !important;}
  .solar-phase-left{grid-column:1 !important;grid-row:1 !important;}
  .solar-back-hub-btn{grid-column:2 !important;grid-row:1 !important;justify-self:end !important;align-self:center !important;padding:0.45rem 0.85rem !important;font-size:0.78rem !important;}
  .solar-live-count-top{grid-column:1 / -1 !important;grid-row:2 !important;justify-self:stretch !important;justify-content:center !important;padding:0.375rem 0.75rem !important;font-size:0.8rem !important;}
  .solar-live-count-top span{font-size:0.8rem !important;}
  .solar-sun-icon{font-size:1.75rem !important;}
  .solar-phase-info h2{font-size:1rem !important;}
  .solar-phase-info p{font-size:0.78rem !important;margin-top:0.15rem !important;}
  /* Content */
  .solar-content-wrapper{padding:1.25rem 1rem 2.5rem !important;}
  .solar-sun-visual{margin-bottom:1.5rem !important;}
  .solar-sun-glow{width:100px !important;height:100px !important;}
  .solar-intro-card{padding:1.25rem !important;margin-bottom:1.5rem !important;border-radius:14px !important;}
  .solar-season-img{max-width:220px !important;margin-bottom:1rem !important;}
  .solar-intro-card p{font-size:0.95rem !important;line-height:1.65 !important;}
  /* Mode toggle */
  .solar-mode-toggle{grid-template-columns:1fr !important;gap:0.4rem !important;margin-bottom:1.25rem !important;padding:.25rem !important;}
  .solar-mode-btn{padding:0.75rem !important;font-size:0.9rem !important;justify-content:center !important;}
  .solar-mode-description{margin-bottom:1.25rem !important;}
  .solar-mode-description h3{font-size:1.2rem !important;}
  .solar-mode-description p{font-size:0.9rem !important;}
  /* Practices */
  .solar-practices-grid{grid-template-columns:1fr !important;gap:0.875rem !important;margin-bottom:1.5rem !important;max-width:100% !important;}
  .solar-practice-card{padding:1.1rem !important;}
  .solar-practice-title{font-size:1.05rem !important;margin-bottom:0.375rem !important;}
  .solar-practice-desc{font-size:0.875rem !important;}
  .solar-practice-icon{width:40px !important;height:40px !important;margin-bottom:0.75rem !important;border-radius:10px !important;}
  .solar-practice-icon svg{width:20px !important;height:20px !important;}
  /* Saved inputs */
  .solar-saved-inputs{padding:1.25rem !important;border-radius:14px !important;}
  .solar-saved-inputs h3{font-size:1.2rem !important;margin-bottom:1rem !important;}
  .solar-input-display{padding:1rem !important;border-radius:10px !important;}
  .solar-input-display h4{font-size:0.9rem !important;}
  .solar-input-display p{font-size:0.9rem !important;}
  /* Group */
  .solar-group-container{padding:1.5rem 1rem !important;border-radius:16px !important;}
  .solar-group-emoji{font-size:2rem !important;margin-bottom:0.75rem !important;}
  .solar-group-title{font-size:1.3rem !important;margin-bottom:0.75rem !important;}
  .solar-group-desc{font-size:0.9rem !important;line-height:1.6 !important;margin-bottom:1.25rem !important;}
  .solar-live-badge{padding:0.75rem 1rem !important;margin-bottom:1.25rem !important;border-radius:10px !important;}
  .solar-live-badge span{font-size:0.875rem !important;}
  .solar-group-list{font-size:0.875rem !important;max-width:100% !important;margin-bottom:1.25rem !important;padding-left:0 !important;}
  .solar-group-list li{margin-bottom:0.5rem !important;padding-left:1.25rem !important;font-size:0.875rem !important;}
  .solar-btn-primary{padding:0.875rem 1.5rem !important;font-size:1rem !important;width:100%;box-sizing:border-box;}
  .solar-group-note{font-size:0.8rem !important;margin-top:1rem !important;}
  /* Closure */
  .solar-closure{padding:1.25rem !important;margin:1.5rem 0 1rem !important;border-radius:14px !important;}
  .solar-closure h3{font-size:1.2rem !important;margin-bottom:0.75rem !important;}
  .solar-closure p{font-size:0.9rem !important;margin-bottom:1rem !important;}
  .solar-textarea{font-size:0.9rem !important;padding:0.75rem !important;min-height:80px !important;border-radius:10px !important;}
  .solar-btn-secondary{padding:0.75rem 1.25rem !important;font-size:0.9rem !important;width:100%;box-sizing:border-box;}
  /* Popup — sheet from bottom */
  .solar-popup-overlay{padding:0 !important;align-items:flex-end !important;}
  .solar-popup-content{max-width:100% !important;width:100% !important;max-height:92vh !important;border-radius:24px 24px 0 0 !important;}
  .solar-popup-header{padding:1.25rem 1.25rem 0.875rem !important;}
  .solar-popup-header h2{font-size:1.2rem !important;}
  .solar-popup-close{font-size:.8rem !important;padding:.3rem .875rem !important;}
  .solar-popup-body{padding:1.25rem !important;}
  .solar-popup-section{margin-bottom:1.25rem !important;}
  .solar-popup-section h3{font-size:1.1rem !important;margin-bottom:0.625rem !important;}
  .solar-popup-section p,.solar-popup-section li{font-size:0.9rem !important;line-height:1.6 !important;}
  .solar-popup-highlight{padding:0.75rem 1rem !important;border-radius:8px !important;margin:0.875rem 0 !important;}
  .solar-popup-footer{padding:1rem 1.25rem !important;}
  .solar-popup-btn{padding:0.875rem !important;font-size:0.95rem !important;}
  .solar-affirmation-btn{font-size:0.875rem !important;padding:0.625rem !important;}
  /* Inactive */
  .solar-inactive{padding:1.25rem !important;}
  .solar-inactive-title{font-size:clamp(1.5rem,7vw,2.5rem) !important;}
  .solar-inactive-subtitle{font-size:1rem !important;}
  .solar-inactive-card{padding:1.5rem 1rem !important;border-radius:14px !important;}
  .solar-inactive-card h2{font-size:1.2rem !important;}
  .solar-inactive-card p{font-size:0.9rem !important;}
  .solar-inactive-sun{width:80px !important;height:80px !important;}
}

/* ── Responsive: extra small (max 380px) ─────────────────────────────────── */
@media (max-width:380px) {
  .solar-sun-glow{width:72px !important;height:72px !important;}
  .solar-content-wrapper{padding:0.75rem 0.625rem 1.5rem !important;}
  .solar-intro-card{padding:0.875rem !important;}
  .solar-season-img{max-width:160px !important;}
  .solar-inactive-title{font-size:clamp(1.3rem,7vw,2rem) !important;}
  .solar-inactive-card{padding:1.25rem 0.875rem !important;}
}
    `}};window.SolarUIManager=Nt;const Ut={location:{latitude:31,longitude:0,name:"Default"},currentSolarData:null,currentSolarRoom:null,solarRooms:[{season:"spring",icon:"🌱",roomName:"Spring Awakening",roomId:"spring-equinox",description:"Renewal energy and fresh beginnings",energy:"Renewal, Growth, Awakening",practices:["Dawn meditation","Renewal rituals","Energy activation","New beginning visualization"]},{season:"summer",icon:"☀️",roomName:"Summer Radiance",roomId:"summer-solstice",description:"Peak vitality and expansive energy",energy:"Vitality, Expansion, Power",practices:["Solar noon meditation","Fire ceremony","Peak energy practice","Celebration ritual"]},{season:"autumn",icon:"🍂",roomName:"Autumn Harvest",roomId:"autumn-equinox",description:"Gratitude and preparation for rest",energy:"Gratitude, Harvest, Balance",practices:["Gratitude meditation","Harvest ritual","Balance practice","Reflection ceremony"]},{season:"winter",icon:"❄️",roomName:"Winter Stillness",roomId:"winter-solstice",description:"Deep rest and inner contemplation",energy:"Rest, Stillness, Contemplation",practices:["Deep rest meditation","Inner journey","Stillness practice","Contemplative silence"]}],init(){if(this._initialized)return;this._initialized=!0;const t=()=>this.updateAll();navigator.geolocation?navigator.geolocation.getCurrentPosition(({coords:e})=>{this.location={latitude:e.latitude,longitude:e.longitude,name:"Your Location"},t()},t,{timeout:5e3,maximumAge:36e5}):t(),setInterval(t,be.UPDATE_INTERVAL_MS)},updateAll(){this.updateSolarData(),this.updateSolarVisualization(),this.updateSolarRoom(),this.renderSolarCard()},setLocation(t,e,i){this.location={latitude:t,longitude:e,name:i},this.updateAll()},updateSolarData(){const t=new Date,{latitude:e,longitude:i}=this.location,o=ve.getTimes(t,e,i),n=this.calculateSunDeclination(t),{name:r,days:a}=this._getNextTransition(t);this.currentSolarData={sunrise:o.sunrise,sunset:o.sunset,solarNoon:o.solarNoon,declination:n,seasonInfo:this.getSeasonInfo(t),currentSeason:this.getCurrentSeason(),nextSeasonName:r,daysToNextSeason:a,position:ve.getPosition(t,e,i)},this.renderSolarInfo()},renderSolarInfo(){const t=this.currentSolarData;if(!t)return;const e=(o,n)=>{const r=document.getElementById(o);r&&(r.textContent=n)};e("sunrise",this.formatTime(t.sunrise)),e("sunset",this.formatTime(t.sunset)),e("solarNoon",this.formatTime(t.solarNoon)),e("seasonInfo",t.seasonInfo);const i=document.getElementById("solarDeclination");if(i){const o=i.querySelector(".decl-value");o&&(o.textContent=`${Math.abs(t.declination).toFixed(1)}° ${t.declination>=0?"N":"S"}`)}},calculateSunDeclination(t){const e=this.getDayOfYear(t);return 23.44*Math.sin(2*Math.PI*(e-81)/365)},getDayOfYear(t){return Math.floor((t-new Date(t.getFullYear(),0,0))/864e5)},getSeasonDates(t){if(this._seasonDatesCache||(this._seasonDatesCache={}),this._seasonDatesCache[t])return this._seasonDatesCache[t];const e=(t-2e3)/1e3,i=m=>{const g={spring:[245162380984e-5,365242.37404,.05169,-.00411,-57e-5],summer:[245171656767e-5,365241.62603,.00325,.00888,-3e-4],autumn:[245181021715e-5,365242.01767,-.11575,.00337,78e-5],winter:[245190005952e-5,365242.74049,-.06223,-.00823,32e-5]}[m];return g[0]+g[1]*e+g[2]*e**2+g[3]*e**3+g[4]*e**4},o=m=>{const g=(m-2451545)/36525,f=35999.373*g-2.47,b=1+.0334*Math.cos(f*Math.PI/180)+7e-4*Math.cos(2*f*Math.PI/180),M=[[485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],[182,27.85,445267.112],[156,73.14,45036.886],[136,171.52,22518.443],[77,222.54,65928.934],[74,296.72,3034.906],[70,243.58,9037.513],[58,119.81,33718.148],[52,297.17,150.678],[50,21.02,2281.226]].reduce((C,[_,k,A])=>C+_*Math.cos((k+A*g)*Math.PI/180),0);return m+1e-5*M/b},n=m=>new Date((m-24405875e-1)*864e5),r=m=>new Date(m.getTime()-864e5),a=m=>n(o(i(m))),s=a("spring"),l=a("summer"),d=a("autumn"),c=a("winter"),p=n(o((()=>{const m=(t+1-2e3)/1e3,g=[245162380984e-5,365242.37404,.05169,-.00411,-57e-5];return g[0]+g[1]*m+g[2]*m**2+g[3]*m**3+g[4]*m**4})())),h={spring:{start:s,end:r(l)},summer:{start:l,end:r(d)},autumn:{start:d,end:r(c)},winter:{start:c,end:r(p)}};return this._seasonDatesCache[t]=h,h},getCurrentSeason(){const t=new Date,e=t.getFullYear(),i=this.location.latitude>=0,o={spring:"autumn",summer:"winter",autumn:"spring",winter:"summer"},n=this.getSeasonDates(e-1);if(t>=n.winter.start&&t<=n.winter.end)return i?"winter":"summer";const r=this.getSeasonDates(e);for(const a of["spring","summer","autumn","winter"]){const{start:s,end:l}=r[a];if(t>=s&&t<=l)return i?a:o[a]}return"winter"},_getUpcomingTransitions(t){const e=t.getFullYear(),i=this.getSeasonDates(e),o=this.getSeasonDates(e+1);return[{name:"Spring Equinox",date:i.spring.start},{name:"Summer Solstice",date:i.summer.start},{name:"Autumn Equinox",date:i.autumn.start},{name:"Winter Solstice",date:i.winter.start},{name:"Spring Equinox",date:o.spring.start}].filter(n=>n.date>t).sort((n,r)=>n.date-r.date)},getSeasonInfo(t){const e=this._getUpcomingTransitions(t)[0];return`${Math.ceil((e.date-t)/864e5)} days to ${e.name}`},_getNextTransition(t){const e=this._getUpcomingTransitions(t)[0];return{name:e.name.split(" ")[0],days:Math.ceil((e.date-t)/864e5)}},getNextSeasonInfo(t){return this._getNextTransition(t)},updateSolarVisualization(){this.currentSolarData&&this.drawWheelOfYear(this.currentSolarData)},drawWheelOfYear(t){var V;const e=document.getElementById("solarSvg");if(!e)return;const i=280,o=140,n=140,r=110,a=52;e.setAttribute("viewBox",`0 0 ${i} ${i}`),e.setAttribute("width","100%"),e.style.height="auto",e.innerHTML="";const s="http://www.w3.org/2000/svg",l=($,S)=>{const F=document.createElementNS(s,$);return Object.entries(S).forEach(([G,Z])=>F.setAttribute(G,Z)),F},d=l("defs",{}),c=l("clipPath",{id:"woyClip"});c.appendChild(l("circle",{cx:o,cy:n,r:r-1})),d.appendChild(c),e.appendChild(d);const p=[{d:`M${o},${n} L${o},${n-r} L${o+r},${n-r} L${o+r},${n} Z`,fill:"#C0DD97"},{d:`M${o},${n} L${o+r},${n} L${o+r},${n+r} L${o},${n+r} Z`,fill:"#FAC775"},{d:`M${o},${n} L${o},${n+r} L${o-r},${n+r} L${o-r},${n} Z`,fill:"#F0957B"},{d:`M${o},${n} L${o-r},${n} L${o-r},${n-r} L${o},${n-r} Z`,fill:"#B5D4F4"}],h=l("g",{"clip-path":"url(#woyClip)"});p.forEach(({d:$,fill:S})=>h.appendChild(l("path",{d:$,fill:S,opacity:"0.45",stroke:"none"}))),e.appendChild(h),e.appendChild(l("circle",{cx:o,cy:n,r,fill:"none",stroke:"var(--neuro-shadow-light)","stroke-width":"1.5"})),e.appendChild(l("circle",{cx:o,cy:n,r:a,fill:"none",stroke:"var(--neuro-shadow-light)","stroke-width":"1","stroke-dasharray":"3 3",opacity:"0.6"})),e.appendChild(l("line",{x1:o-r,y1:n,x2:o+r,y2:n,stroke:"var(--neuro-shadow-light)","stroke-width":"0.8"})),e.appendChild(l("line",{x1:o,y1:n-r,x2:o,y2:n+r,stroke:"var(--neuro-shadow-light)","stroke-width":"0.8"}));const m=($,S,F,G,Z,Q)=>{const ee=l("text",{x:$,y:S,"text-anchor":"middle",fill:Z,"font-size":"9","font-weight":"600"});ee.textContent=F,e.appendChild(ee);const y=l("text",{x:$,y:S+11,"text-anchor":"middle",fill:Q,"font-size":"7.5"});y.textContent=G,e.appendChild(y)};m(o+55,n-40,"Spring","Mar · Apr · May","#3B6D11","#639922"),m(o+55,n+52,"Summer","Jun · Jul · Aug","#854F0B","#BA7517"),m(o-55,n+52,"Autumn","Sep · Oct · Nov","#993C1D","#D85A30"),m(o-55,n-40,"Winter","Dec · Jan · Feb","#185FA5","#378ADD");const g=($,S,F)=>{const G=l("text",{x:$,y:S,"text-anchor":"middle","font-size":"11"});G.textContent=F,e.appendChild(G)};g(o,n-r+8,"🌱"),g(o+r-6,n+4,"☀️"),g(o,n+r-2,"🍂"),g(o-r+6,n+4,"❄️"),[[o,n-r,o,n-r+8],[o+r,n,o+r-8,n],[o,n+r,o,n+r-8],[o-r,n,o-r+8,n]].forEach(([$,S,F,G])=>e.appendChild(l("line",{x1:$,y1:S,x2:F,y2:G,stroke:"var(--neuro-text)","stroke-width":"1.5","stroke-linecap":"round"})));const f=79,b=new Date,M=this.getDayOfYear(b),C=-Math.PI/2+(M-f)/365*2*Math.PI,_=o+r*Math.cos(C),k=n+r*Math.sin(C);for(let $=0;$<8;$++){const S=$*Math.PI/4;e.appendChild(l("line",{x1:_+Math.cos(S)*10,y1:k+Math.sin(S)*10,x2:_+Math.cos(S)*15,y2:k+Math.sin(S)*15,stroke:"#EF9F27","stroke-width":"1.5","stroke-linecap":"round"}))}e.appendChild(l("circle",{cx:_,cy:k,r:"8",fill:"#EF9F27",stroke:"#BA7517","stroke-width":"1.2"})),e.appendChild(l("circle",{cx:_,cy:k,r:"3.5",fill:"#FCDE5A",opacity:"0.9"}));const{nextSeasonName:A,daysToNextSeason:j}=t,T=b.toLocaleDateString("en-US",{month:"short",day:"numeric"}),P=this.getCurrentSeason(),U=P.charAt(0).toUpperCase()+P.slice(1),B=((V=this.getSeasonDates(b.getFullYear())[P])==null?void 0:V.start)||b,W=Math.max(1,Math.floor((b-B)/864e5)+1),O=($,S,F,G,Z)=>{const Q=l("text",{x:o,y:S,"text-anchor":"middle",fill:Z,"font-size":F,"font-weight":G});Q.textContent=$,e.appendChild(Q)};O(T,n-10,"9","700","var(--neuro-text)"),O(`${W} days in ${U}`,n+3,"7.5","400","var(--neuro-text-light)"),O(`${j} days to ${A}`,n+15,"7.5","400","#BA7517")},updateSolarRoom(){const t=this.getCurrentSeason(),e=this.solarRooms.find(i=>i.season===t);e&&e!==this.currentSolarRoom&&(this.currentSolarRoom=e,this.renderSolarRoom(e))},renderSolarRoom(t){const e=(o,n)=>{const r=document.getElementById(o);r&&(r.textContent=n)};e("solarRoomIcon",t.icon),e("solarRoomName",t.roomName),e("solarRoomDesc",t.description);const i=document.getElementById("solarPracticeRoom");i&&(i.setAttribute("data-room-id",t.roomId),i.setAttribute("data-room-energy",t.energy))},getCurrentRoom(){return this.currentSolarRoom},renderSolarCard(){var r,a,s;const t=document.getElementById("solarContainer");if(!t){console.warn("SolarEngine: solarContainer not found");return}if(!this.currentSolarData||!this.currentSolarRoom){t.innerHTML='<p style="color:var(--text-muted);padding:20px;">Loading solar data...</p>';return}const{currentSolarData:e,currentSolarRoom:i}=this,o=(s=(a=(r=window.Core)==null?void 0:r.state)==null?void 0:a.currentUser)==null?void 0:s.is_admin,n=e.currentSeason.charAt(0).toUpperCase()+e.currentSeason.slice(1);t.innerHTML=`
      <div class="celestial-card-full solar-card">
        <div class="celestial-content-horizontal">
          <div class="celestial-visual-section">
            <div class="solar-visual" id="solarVisual">
              <svg width="100%" viewBox="0 0 280 280" id="solarSvg" style="max-width:280px;display:block;margin:0 auto;" aria-hidden="true" focusable="false"></svg>
            </div>
          </div>
          <div class="celestial-info-section">
            <div class="celestial-info-title">Solar Position &amp; Seasons</div>
            <div class="solar-info">
              <div class="solar-season-name">${n}</div>
              <div class="solar-declination">Declination: <span class="decl-value">${e.declination>0?"+":""}${e.declination.toFixed(1)}°</span></div>
            </div>
            <div class="next-season">Next: ${e.nextSeasonName} (${e.daysToNextSeason} days)</div>
          </div>
          <div class="celestial-times-section">
            <div class="celestial-time">
              <span class="time-label">Sunrise</span>
              <span class="time-value" id="sunrise">${this.formatTime(e.sunrise)}</span>
            </div>
            <div class="celestial-time">
              <span class="time-label">Sunset</span>
              <span class="time-value" id="sunset">${this.formatTime(e.sunset)}</span>
            </div>
          </div>
        </div>

        <div class="celestial-practice-room" data-room-type="solar" id="solarPracticeRoom">
          <div class="room-divider"></div>
          <div class="room-content-inline">
            <div class="room-header-inline">
              <div class="room-icon-inline" id="solarRoomIcon">${i.icon}</div>
              <div class="room-info-inline">
                <div class="room-name-inline" id="solarRoomName">${i.roomName}</div>
                <div class="room-desc-inline" id="solarRoomDesc">${i.description}</div>
              </div>
            </div>
            <div class="room-meta-inline">
              <div class="room-energy">
                <div class="energy-pulse" style="background:var(--ring-guiding);"></div>
                <span id="solarRoomPresence">0 present</span>
              </div>
              <button type="button" class="btn btn-primary join-btn-inline" onclick="SolarEngine.joinSolarRoom()">Join Space</button>
            </div>
          </div>
        </div>

        ${o?this.renderAdminSection():""}
      </div>`,this.updateSolarVisualization(),this._refreshOuterCard(),this._attachSolarAdminListeners()},_attachSolarAdminListeners(){const t=document.querySelector(".solar-admin-header");if(t&&!t._solarBound){const e=()=>{const i=document.getElementById(t.dataset.panel),o=document.getElementById(t.dataset.toggle),n=(i==null?void 0:i.style.display)!=="none";i&&(i.style.display=n?"none":"block"),o&&(o.textContent=n?"▶":"▼"),t.setAttribute("aria-expanded",String(!n))};t.addEventListener("click",e),t.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),e())}),t._solarBound=!0}document.querySelectorAll(".solar-admin-header ~ div button[data-room-id]").forEach(e=>{e._solarBound||(e.addEventListener("click",()=>this.adminJoinRoom(e.dataset.roomId)),e.addEventListener("mouseover",()=>e.style.background="var(--border)"),e.addEventListener("mouseout",()=>e.style.background="var(--season-mood)"),e._solarBound=!0)})},_refreshOuterCard(){var o;if(!(u!=null&&u.ready)){this._outerCardRetry||(this._outerCardRetry=setTimeout(()=>{this._outerCardRetry=null,this._refreshOuterCard()},500));return}const t=this.currentSolarRoom;if(!t)return;const e=`${t.season}-solar`,i=async()=>{try{const n=await u.getRoomParticipants(e),r=document.getElementById("solarRoomPresence");r&&(r.textContent=`${n.length} present`)}catch(n){console.warn("[SolarEngine] _refreshOuterCard error:",n)}};i();try{(o=this._outerCardSub)==null||o.unsubscribe()}catch{}this._outerCardSub=u.subscribeToPresence(i)},renderAdminSection(){const t="solarAdminPanel",e="solarAdminToggle";return`
      <div style="margin-top:24px;border-radius:var(--radius-lg);border:2px dashed var(--neuro-accent-a30);overflow:hidden;">
        <div class="solar-admin-header" role="button" tabindex="0" aria-expanded="false" data-panel="${t}" data-toggle="${e}">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN: Enter Any Solar Room</span>
          <span id="${e}" style="font-size:11px;">▶</span>
        </div>
        <div id="${t}" style="padding:16px 20px;background:var(--neuro-bg-lighter);border-top:1px solid var(--neuro-accent-a10);display:none;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            ${this.solarRooms.map(i=>`
              <button type="button" data-room-id="${i.roomId}"
                      style="padding:12px;background:var(--season-mood);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;text-align:left;transition:all 0.2s;">
                <div style="font-size:24px;margin-bottom:4px;">${i.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${i.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;text-transform:capitalize;">${i.season}</div>
              </button>`).join("")}
          </div>
        </div>
      </div>`},adminJoinRoom(t){this._loadAndEnterRoom(t)},injectAdminUI(){var i,o,n;if(!((n=(o=(i=window.Core)==null?void 0:i.state)==null?void 0:o.currentUser)!=null&&n.is_admin))return;const t=document.getElementById("solarContainer");if(!t||t.querySelector("#solarAdminPanel"))return;const e=t.querySelector(".celestial-card-full");e&&e.insertAdjacentHTML("beforeend",this.renderAdminSection())},_ROOM_MODULES:{"spring-equinox":()=>ue(()=>import("./spring-solar-room-xv1H8Nlh.js"),__vite__mapDeps([5,6])),"summer-solstice":()=>ue(()=>import("./summer-solar-room-Bx5lIIsI.js"),__vite__mapDeps([7,6])),"autumn-equinox":()=>ue(()=>import("./autumn-solar-room-CaH4Q02Z.js"),__vite__mapDeps([8,6])),"winter-solstice":()=>ue(()=>import("./winter-solar-room-CwgUKbUq.js"),__vite__mapDeps([9,6]))},_roomExportName:{"spring-equinox":"SpringSolarRoom","summer-solstice":"SummerSolarRoom","autumn-equinox":"AutumnSolarRoom","winter-solstice":"WinterSolarRoom"},async _loadAndEnterRoom(t){var i,o,n,r,a,s;const e=this._ROOM_MODULES[t];if(!e){(o=(i=window.Core)==null?void 0:i.showToast)==null||o.call(i,`Unknown room: ${t}`);return}try{const d=(await e())[this._roomExportName[t]];d?d.enterRoom():(r=(n=window.Core)==null?void 0:n.showToast)==null||r.call(n,`${t} failed to initialise`)}catch(l){console.error(`[SolarEngine] _loadAndEnterRoom error for ${t}:`,l),(s=(a=window.Core)==null?void 0:a.showToast)==null||s.call(a,`Failed to load ${t}`)}},joinSolarRoom(){var t,e;if(!this.currentSolarRoom){(e=(t=window.Core)==null?void 0:t.showToast)==null||e.call(t,"Solar room not ready");return}this._loadAndEnterRoom(this.currentSolarRoom.roomId)},formatTime:t=>!t||isNaN(t.getTime())?"N/A":t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0}),formatDate:t=>t.toLocaleDateString("en-US",{month:"short",day:"numeric"}),getSolarData(){return this.currentSolarData}};window.SolarEngine=Ut;class je extends L{constructor(){super({roomId:"silent",roomType:"always-open",name:"Silent Meditation",icon:"🧘",description:"Join others in silence. No guidance, shared energy.",energy:"Peaceful",imageUrl:"/Community/Silent.webp",participants:4}),this.initTimerState(1200),this.initSoundState(),this.affirmations=["Breathe in peace, breathe out tension","This moment is enough","I am here, I am present","Let go of what was, embrace what is","In stillness, I find clarity","My breath is my anchor","I trust the process of life","Peace begins within","I am worthy of this rest","This too shall pass"],this._affirmationInterval=null}onEnter(){this.startAffirmations()}onLeave(){this.resetTimer(),this._resetDimMode()}onCleanup(){this.cleanupTimer(),this.cleanupSound(),this._affirmationInterval&&(clearInterval(this._affirmationInterval),this._affirmationInterval=null),this._affirmationVisibilityHandler&&(document.removeEventListener("visibilitychange",this._affirmationVisibilityHandler),this._affirmationVisibilityHandler=null)}onOutsideClick(e){const i=document.getElementById(`${this.roomId}SoundSettings`);i&&!i.contains(e.target)&&!e.target.closest('[data-action="toggleSoundSettings"]')&&i.classList.remove("visible")}buildAdditionalHeaderButtons(){return`
            ${this.buildSoundButton()}
            <button type="button" class="ps-leave" data-action="toggleDimMode"
                    id="${this.roomId}DimModeBtn" style="padding:10px 16px;white-space:nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim
            </button>`}buildBody(){return`
        ${this.buildSoundSettings()}
        <div class="ps-body">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;">
                <div id="${this.roomId}RotatingAffirmation" aria-live="polite" aria-atomic="true"
                     style="position:relative;max-width:650px;text-align:center;font-size:22px;font-weight:600;letter-spacing:0.02em;line-height:1.6;margin-bottom:30px;z-index:10;opacity:0.7;transition:opacity 0.5s ease;">
                </div>
                ${this.buildTimerContainer({subtitle:"in silence",gradientId:"silentTimerGrad",color1:"#4ade80",color2:"#16a34a",glowColor:"rgba(74,222,128,0.7)"})}
                ${this.buildTimerControls()}
            </main>
        </div>`}getInstructions(){return`
            <p><strong>Welcome to the Silent Meditation space.</strong></p>
            <h3>How to Practice:</h3>
            <ul>
                <li>Set your timer using +/- buttons</li>
                <li>Click "Begin" to start</li>
                <li>Focus on your breath</li>
                <li>Use the timer ring as a visual anchor</li>
            </ul>
            <h3>Sound Settings:</h3>
            <ul>
                <li>5-minute bells for gentle reminders</li>
                <li>Ambient sounds for atmosphere</li>
                <li>Completion bell when session ends</li>
            </ul>`}startAffirmations(){this.rotateAffirmation(),this._affirmationInterval=setInterval(()=>this.rotateAffirmation(),8e3),this._affirmationVisibilityHandler=()=>{document.hidden?this._affirmationInterval&&(clearInterval(this._affirmationInterval),this._affirmationInterval=null):this._affirmationInterval||(this.rotateAffirmation(),this._affirmationInterval=setInterval(()=>this.rotateAffirmation(),8e3))},document.addEventListener("visibilitychange",this._affirmationVisibilityHandler)}rotateAffirmation(){const e=document.getElementById(`${this.roomId}RotatingAffirmation`);e&&(e.style.opacity="0",setTimeout(()=>{e.textContent=this.affirmations[Math.floor(Math.random()*this.affirmations.length)],e.style.opacity="0.7"},500))}toggleDimMode(){const e=document.getElementById("dynamicRoomContent");if(!e)return;e.classList.toggle("dimmed");const i=e.classList.contains("dimmed"),o=document.getElementById(`${this.roomId}DimModeBtn`);o&&(o.innerHTML=i?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Bright':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim');const n=document.getElementById("communityHubFullscreenContainer");n&&(n.style.background=i?"rgba(0,0,0,0.85)":"transparent")}_resetDimMode(){const e=document.getElementById("dynamicRoomContent");e&&e.classList.remove("dimmed");const i=document.getElementById("communityHubFullscreenContainer");i&&(i.style.background="transparent");const o=document.getElementById(`${this.roomId}DimModeBtn`);o&&(o.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim')}offerGratitude(){window.Core.showToast("Gratitude offered to the space");const e=document.getElementById(`${this.roomId}GratitudeContainer`);e&&(e.style.transform="scale(1.05)",setTimeout(()=>{e.style.transform="scale(1)"},200))}getActions(){return{...super.getActions(),toggleDimMode:()=>this.toggleDimMode()}}}Object.assign(je.prototype,dt);Object.assign(je.prototype,lt);const Ft=new je;window.SilentRoom=Ft;var Xe;(Xe=window.dispatchRoomReady)==null||Xe.call(window,"silent");class Gt extends xe{constructor(){super({roomId:"guided",roomType:"timed",name:"Guided Meditation",icon:"🎧",description:"Aanandoham's Curated Guided Visualizations. Synchronized guided sessions for the whole community - together, worldwide. A new meditation begins every hour. Drop in, tune out, come back renewed. View Schedule for details.",energy:"Focused",imageUrl:"/Community/Visualization.webp",participants:0,cycleDuration:3600,openDuration:900,sessionDuration:2700}),this.scheduleModalTitle="📅 Today's Meditation Schedule",this.sessions=[{title:"Grounding to the Center of Earth",duration:"29:56",category:"Grounding",videoId:"_KedpeSYwgA",emoji:"🌍"},{title:"Aura Adjustment and Cleaning",duration:"29:56",category:"Energy",videoId:"gIMfdNkAC4g",emoji:"✨"},{title:"Chakra Cleaning",duration:"39:58",category:"Chakras",videoId:"BFvmLeYg7cE",emoji:"🌈"},{title:"The Center of the Universe",duration:"29:56",category:"Spiritual",videoId:"1T2dNQ4M7Ko",emoji:"🌌"},{title:"Blowing Roses Healing Technique",duration:"29:56",category:"Healing",videoId:"3yQrtsHbSBo",emoji:"🌹"},{title:"3 Wishes Manifestation",duration:"29:52",category:"Manifestation",videoId:"EvRa_qwgJao",emoji:"⭐"},{title:"Meeting your Higher Self",duration:"29:56",category:"Premium",videoId:"34mla-PnpeU",emoji:"💎"},{title:"Inner Temple",duration:"29:46",category:"Premium",videoId:"t6o6lpftZBA",emoji:"🔮"},{title:"Gratitude Practice",duration:"29:56",category:"Premium",videoId:"JyTwWAhsiq8",emoji:"👑"}]}getInstructions(){return`
            <p><strong>Hourly guided meditation sessions.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>A new session begins every hour, on the hour</li>
                <li>Open window: :00 to :15 - enter before :15 to join</li>
                <li>Session runs 45 minutes · Room closes at :15</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>9 meditations rotating hourly</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Find a comfortable seated position</li>
                <li>Close your eyes or soften your gaze</li>
                <li>Follow the guided instructions</li>
                <li>Allow yourself to fully receive</li>
            </ul>`}}const Wt=new Gt;window.GuidedRoom=Wt;var Ze;(Ze=window.dispatchRoomReady)==null||Ze.call(window,"guided");class qt extends xe{constructor(){super({roomId:"osho",roomType:"timed",name:"OSHO Active",icon:"💃",description:"OSHO Active Meditations practices (with instructions). View Schedule for details.",energy:"Dynamic",imageUrl:"/Community/OSHO.webp",participants:0,cycleDuration:5400,openDuration:600,sessionDuration:4800}),this.scheduleModalTitle="📅 Upcoming OSHO Sessions",this.sessions=[{title:"OSHO Dynamic Meditation",duration:"77:00",category:"Energy",introVideoId:"Q_PFlkHH7IA",videoId:"tLUxtq3peR8",emoji:"🔥"},{title:"OSHO Kundalini Meditation",duration:"77:00",category:"Movement",introVideoId:"O3-wH2VBdN8",videoId:"vEyageQp6w8",emoji:"💃"},{title:"OSHO Nadabrahma Meditation",duration:"77:00",category:"Humming",introVideoId:"tnVsMXf88Pw",videoId:"yVGhzBVT64A",emoji:"🕉️"},{title:"OSHO Nataraj Meditation",duration:"77:00",category:"Dance",introVideoId:"pxg3FmOeQhk",videoId:"grSjP12Q4Oc",emoji:"🎭"},{title:"OSHO Whirling Meditation",duration:"77:00",category:"Spinning",introVideoId:"Jk2AaABIKTY",videoId:"EKvLFs9niXY",emoji:"🌀"}]}onEnter(){this._playingIntro=!1,super.onEnter()}initPlayer(){if(this.state.playerInitialized)return;const e=this.getCurrentSession();if(!(e!=null&&e.introVideoId)){super.initPlayer();return}this._playingIntro=!0,this.state.player=new YT.Player(`${this.roomId}-youtube-player`,{videoId:e.introVideoId,playerVars:{autoplay:0,controls:1,modestbranding:1,rel:0,mute:1},events:{onReady:i=>this.onPlayerReady(i),onStateChange:i=>this.onPlayerStateChange(i)}}),this.state.playerInitialized=!0}startSession(){var i,o,n;if(!this.state.playerReady||this.state.sessionStarted)return;const e=this.getCurrentSession();e&&(this._playingIntro=!0,this._showPlayer(),(i=this.state.player)==null||i.unMute(),(o=this.state.player)==null||o.setVolume(100),(n=this.state.player)==null||n.playVideo(),this.state.sessionStarted=!0,window.Core.showToast(`${e.emoji} Intro starting…`))}onVideoEnded(){if(this._playingIntro){this._playingIntro=!1;const e=this.getCurrentSession();e!=null&&e.videoId&&this.state.player&&(this.state.player.loadVideoById(e.videoId),this.state.player.playVideo(),window.Core.showToast(`${e.emoji} Practice starting…`))}else this.stopProgressTracking(),window.Core.showToast("Session complete")}getInstructions(){return`
            <p><strong>Active OSHO meditation techniques every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>Each session begins with guided instructions, then the full practice</li>
                <li>5 OSHO methods rotating each cycle</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Enter during the open window</li>
                <li>Express freely - move, breathe, sound</li>
                <li>Allow whatever arises</li>
            </ul>
            <h3>The 5 Methods:</h3>
            <ul>
                <li>🔥 Dynamic - Cathartic active meditation</li>
                <li>💃 Kundalini - Shaking and dancing</li>
                <li>🕉️ Nadabrahma - Humming meditation</li>
                <li>🎭 Nataraj - Dance meditation</li>
                <li>🌀 Whirling - Sufi spinning meditation</li>
            </ul>`}}const Vt=new qt;window.OshoRoom=Vt;var Qe;(Qe=window.dispatchRoomReady)==null||Qe.call(window,"osho");class Yt extends xe{constructor(){super({roomId:"breathwork",roomType:"timed",name:"Breathwork",icon:"💨",description:"Unique Breathwork Sessions, from different modalities and techniques. View Schedule for details.",energy:"Transformative",imageUrl:"/Community/Breathwork.webp",participants:0,cycleDuration:5400,openDuration:600,sessionDuration:4800}),this.scheduleModalTitle="📅 Upcoming Breathwork Sessions",this.sessions=[{title:"Trauma Release & Emotional Renewal",duration:"70:00",category:"Healing",videoId:"eocuqWqaKgk",emoji:"💫"},{title:"Rewire Your Brain",duration:"70:00",category:"Transformation",videoId:"6JrHM6UjVpw",emoji:"🧠"},{title:"Meet Your Higher Self",duration:"70:00",category:"Spiritual",videoId:"DAVdAGn5ELw",emoji:"✨"},{title:"Deep Sleep Breathing & Affirmations",duration:"70:00",category:"Rest",videoId:"q3DygsrH9q8",emoji:"🌙"},{title:"Darkness to Light Breathwork Experience",duration:"70:00",category:"Energy",videoId:"Kv7GhUpLUE4",emoji:"🌅"},{title:"Wim Hof Method Breathwork",duration:"70:00",category:"Power",videoId:"CQnW0rLozww",emoji:"❄️"}]}getInstructions(){return`
            <p><strong>Transformative breathwork sessions every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>6 techniques rotating each cycle</li>
            </ul>
            <h3>Safety Guidelines:</h3>
            <ul>
                <li>Find a safe position (lying or seated)</li>
                <li>Never practice while driving or in water</li>
                <li>Stop if you feel dizzy or uncomfortable</li>
            </ul>
            <h3>Techniques:</h3>
            <ul>
                <li>💫 Trauma Release - Emotional renewal and healing</li>
                <li>🧠 Rewire Your Brain - Transformational breathwork</li>
                <li>✨ Higher Self - Spiritual guided breathwork</li>
                <li>🌙 Deep Sleep - Breathing and affirmations</li>
                <li>🌅 Darkness to Light - Energy breathwork experience</li>
                <li>❄️ Wim Hof - Power breathing and breath holds</li>
            </ul>`}}const Kt=new Yt;window.BreathworkRoom=Kt;var et;(et=window.dispatchRoomReady)==null||et.call(window,"breathwork");class Se extends L{constructor(){super({roomId:"deepwork",roomType:"always-open",name:"Digital Nomads Deep Work",icon:"🎯",description:"Focus sessions with your community. Do hard things together. Set your intention. Start the timer. Get it done.",energy:"Focused",imageUrl:"/Community/Focus.webp",participants:12}),this.devMode=!0,this.initTimerState(1800),this.initSoundState(),this.initChatState(["main"]),this.state.currentStatus="deep-focus",this.state.lastFocusStatus="deep-focus",this.state.currentIntention="",this.state.currentCategory="work",this.state.selectedDuration=25,this.state.showSetup=!0,this.CATEGORIES={work:{icon:"💼",label:"WORK",gradient:"linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.2))",border:"rgba(245,158,11,0.3)"},study:{icon:"📚",label:"STUDY",gradient:"linear-gradient(135deg,rgba(59,130,246,0.2),rgba(147,51,234,0.2))",border:"rgba(59,130,246,0.3)"},creative:{icon:"🎨",label:"CREATIVE",gradient:"linear-gradient(135deg,rgba(236,72,153,0.2),rgba(168,85,247,0.2))",border:"rgba(236,72,153,0.3)"},reading:{icon:"📖",label:"READING",gradient:"linear-gradient(135deg,rgba(34,197,94,0.2),rgba(59,130,246,0.2))",border:"rgba(34,197,94,0.3)"},planning:{icon:"📋",label:"PLANNING",gradient:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.2))",border:"rgba(139,92,246,0.3)"},coding:{icon:"💻",label:"CODING",gradient:"linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2))",border:"rgba(16,185,129,0.3)"}}}onEnter(){this.state.showSetup&&setTimeout(()=>this.showSetupModal(),300),this.loadRoomChatFromDB("main"),this._injectSenderAvatar("main"),requestAnimationFrame(()=>{var e;(e=document.querySelector(`#${this.roomId}View .ps-main`))==null||e.scrollTo(0,0)})}onCleanup(){var i;if(this.cleanupTimer(),this.cleanupSound(),u!=null&&u.ready)try{u.unsubscribeFromRoomChat("deepwork")}catch{}const e=document.getElementById("communityHubFullscreenContainer");e&&(e.style.background="transparent"),(i=document.getElementById("dynamicRoomContent"))==null||i.classList.remove("dimmed")}onTimerComplete(){this._switchToBreak()}onOutsideClick(e){const i=document.getElementById(`${this.roomId}SoundSettings`);i&&!i.contains(e.target)&&!e.target.closest('[data-action="toggleSoundSettings"]')&&i.classList.remove("visible")}pauseTimer(){this._clearInterval(),this.state.timerRunning=!1,this._setTimerBtn("paused"),this._setTimerGlow("paused"),this._switchToBreak()}_setTimerBtn(e){const i=document.getElementById(`${this.roomId}TimerBtn`);if(!i)return;const o={idle:"Begin",running:"Break",paused:"Continue",done:"Complete"};i.textContent=o[e]??e}startTimer(){this.state.timerRunning||(this.state.timerRunning=!0,this._setTimerGlow("running"),this._timerInterval=setInterval(()=>{var e;this.state.timeLeft--,this._updateTimer(),this.state.timeLeft>0&&this.state.timeLeft%300===0&&this.state.fiveMinBellEnabled&&((e=this.play5MinBell)==null||e.call(this)),this.state.timeLeft<=0&&this.completeTimer()},1e3),this._attachVisibilityHandler(),this._restoreFocusStatus(),window.Core.showToast("Timer started"))}_switchToBreak(){this.state.currentStatus!=="break"&&(this.state.lastFocusStatus=this.state.currentStatus),this._applyStatus("break")}_restoreFocusStatus(){this._applyStatus(this.state.lastFocusStatus||"deep-focus")}_applyStatus(e){this.state.currentStatus=e;const i=e==="break",o=document.getElementById("currentStatus");o&&(o.textContent=this.getStatusText()),document.querySelectorAll(".dw-status-btn").forEach(n=>{const r=n.dataset.status===e;n.style.background=r?"var(--accent)":"var(--surface)",n.style.color=r?"white":"var(--text)",n.style.border=`2px solid ${r?"var(--accent)":"var(--border)"}`}),this._setChatPanelOpen(i),window.Core.showToast(i?"Break time — chat unlocked!":`${this.getStatusText()}`)}_setChatPanelOpen(e){const i=document.getElementById(`${this.roomId}ChatPanelBody`),o=i==null?void 0:i.previousElementSibling,n=document.getElementById(`${this.roomId}ChatChevron`);i&&(i.style.maxHeight=e?"600px":"0px",i.style.opacity=e?"1":"0"),o&&(o.style.opacity=e?"1":"0.35"),n&&(n.style.transform=e?"rotate(0deg)":"rotate(-90deg)");const r=document.getElementById(`${this.roomId}MainInput`),a=document.getElementById(`${this.roomId}MainSendBtn`);r&&(r.disabled=!e,r.placeholder=e?"Share during your break...":"Pause timer to chat"),a&&(a.disabled=!e)}_toggleChatPanel(){if(this.state.currentStatus!=="break")return;const e=document.getElementById(`${this.roomId}ChatPanelBody`);if(!e)return;const i=e.style.maxHeight!=="0px";this._setChatPanelOpen(!i)}getStatusText(){return{"deep-focus":"DEEP FOCUS","light-focus":"LIGHT FOCUS",break:"BREAK TIME"}[this.state.currentStatus]||"DEEP FOCUS"}changeStatus(e){e!=="break"&&(this.state.lastFocusStatus=e),this._applyStatus(e)}showSetupModal(){var e;(e=document.getElementById(`${this.roomId}SetupModal`))==null||e.classList.add("active")}closeSetupModal(){var e;(e=document.getElementById(`${this.roomId}SetupModal`))==null||e.classList.remove("active")}confirmSetup(){var l;const e=document.getElementById(`${this.roomId}IntentionInput`);this.state.currentIntention=(e==null?void 0:e.value.trim())||"Focus session";const i=this.state.selectedDuration,o=parseInt(i==="custom"?(l=document.getElementById(`${this.roomId}CustomMinutes`))==null?void 0:l.value:i),r=Math.max(1,Math.min(180,o||25))*60;this.state.timeLeft=r,this.state.initialTime=r,this.state.showSetup=!1,this.closeSetupModal(),requestAnimationFrame(()=>{this._updateTimer(),this._setTimerBtn("idle"),setTimeout(()=>this._updateTimer(),50)});const a=document.getElementById("currentIntention"),s=document.getElementById("categoryBadge");if(a&&(a.textContent=this.state.currentIntention||"Use this time to focus and get things done"),s){const d=this.CATEGORIES[this.state.currentCategory];s.innerHTML=`${d.icon} ${d.label}`,s.style.background=d.gradient,s.style.border=`2px solid ${d.border}`}window.Core.showToast("Session set - click Begin!")}_selectTile(e,i,o){document.querySelectorAll(`#${e} [${i}]`).forEach(n=>{const r=String(n.getAttribute(i))===String(o);n.style.border=`2px solid ${r?"var(--accent)":"var(--border)"}`,n.style.background=r?"rgba(139,92,246,0.12)":"var(--surface)"})}selectCategory(e){this.state.currentCategory=e,this._selectTile(`${this.roomId}CategoryTiles`,"data-cat",e)}selectDuration(e){this.state.selectedDuration=e,this._selectTile(`${this.roomId}DurationTiles`,"data-dur",e);const i=document.getElementById(`${this.roomId}CustomDurationDiv`);i&&(i.style.display=e==="custom"?"block":"none")}toggleDimMode(){var n;const e=document.getElementById("dynamicRoomContent");if(!e)return;e.classList.toggle("dimmed");const i=e.classList.contains("dimmed");((n=document.getElementById(`${this.roomId}DimModeBtn`))==null?void 0:n.textContent)!==void 0&&(document.getElementById(`${this.roomId}DimModeBtn`).innerHTML=i?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Bright':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim');const o=document.getElementById("communityHubFullscreenContainer");o&&(o.style.background=i?"rgba(0,0,0,0.85)":"transparent")}getParticipantText(){return`${this.state.participants} working together`}buildAdditionalHeaderButtons(){return`
            ${this.buildSoundButton()}
            <button type="button" class="ps-leave" data-action="toggleDimMode"
                    id="${this.roomId}DimModeBtn" style="margin:0;padding:10px 16px;white-space:nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim
            </button>`}buildBody(){const e=this.CATEGORIES[this.state.currentCategory],i=this.state.currentStatus==="break";return`
        ${this.buildSoundSettings()}
        <div class="ps-body" style="display:flex;flex-direction:column;">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">

                <!-- Category pill (always shown, fallback "Focus") -->
                <div style="margin-bottom:16px;">
                    <span id="categoryBadge" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:${e.gradient};border:2px solid ${e.border};border-radius:var(--radius-full);font-size:14px;font-weight:700;letter-spacing:0.05em;">
                        ${e.icon} ${this.state.currentCategory?e.label:"Focus"}
                    </span>
                </div>

                <!-- Intention -->
                <div style="text-align:center;max-width:600px;margin-bottom:20px;">
                    <div id="currentIntention" style="font-size:clamp(1.1rem,4vw,1.75rem);font-weight:700;letter-spacing:0.02em;line-height:1.4;opacity:0.9;">
                        ${this.state.currentIntention||"Use this time to focus and get things done"}
                    </div>
                </div>

                <!-- Timer ring -->
                ${this.buildTimerContainer({gradientId:"deepworkTimerGrad",color1:"#c1705a",color2:"#8b3a2a",glowColor:"rgba(193,112,90,0.7)",subtitleHtml:`<div id="currentStatus" aria-live="polite" style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${this.getStatusText()}</div>`})}

                <!-- Timer controls -->
                <div style="margin-bottom:24px;">
                ${this.buildTimerControls()}
                </div>

                <!-- Status buttons (below timer) -->
                <div style="display:flex;gap:8px;margin-top:20px;margin-bottom:32px;flex-wrap:wrap;justify-content:center;">
                    ${["deep-focus","light-focus","break"].map(o=>`
                    <button type="button" class="dw-status-btn" data-status="${o}"
                            data-action="changeStatus" data-status="${o}"
                            style="padding:10px 20px;border:2px solid ${this.state.currentStatus===o?"var(--accent)":"var(--border)"};border-radius:var(--radius-md);background:${this.state.currentStatus===o?"var(--accent)":"var(--surface)"};color:${this.state.currentStatus===o?"white":"var(--text)"};cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s;">
                        ${{"deep-focus":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Deep Focus',"light-focus":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Light Focus',break:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg> Break Time'}[o]}
                    </button>`).join("")}
                </div>
            </main>

            <!-- Chat below timer — collapsible -->
            <div style="padding:0 20px 20px;">
                <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;">
                    <!-- Header / toggle row -->
                    <div data-action="toggleChatPanel"
                         style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;user-select:none;opacity:${i?"1":"0.35"};">
                        <div style="display:flex;align-items:center;gap:8px;font-family:var(--serif);font-size:17px;font-weight:600;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:18px;height:18px;"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                            Break Room Chat
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            ${i?"":'<span style="font-size:11px;opacity:0.6;font-style:italic;">☕ Opens on Break</span>'}
                            <svg id="${this.roomId}ChatChevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;transition:transform 0.25s;transform:${i?"rotate(0deg)":"rotate(-90deg)"};">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>
                    <!-- Collapsible body -->
                    <div id="${this.roomId}ChatPanelBody"
                         style="overflow:hidden;max-height:${i?"600px":"0px"};transition:max-height 0.3s ease;opacity:${i?"1":"0"};transition:max-height 0.3s ease,opacity 0.3s ease;">
                        <div style="padding:0 8px 24px;" class="tarot-daily-grid">
                            <div>
                                ${this.buildChatContainer("main","Share during your break...")}
                            </div>
                            ${this.buildParticipantSidebarHTML("Working Together",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
                        </div>
                    </div>
                </div>
            </div>
        </div>`}buildHubModals(){return`
        <div class="modal-overlay" id="${this.roomId}SetupModal" style="z-index:200001;">
            <div class="modal-card" style="max-width:550px;max-height:90vh;overflow-y:auto;">
                <button type="button" class="modal-close" aria-label="Close setup modal" data-action="closeSetupModal">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:8px;text-align:center;">Start Deep Work Session</h2>
                    <p style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:24px;">Set your intention. Choose your time. Work in flow.</p>

                    <div style="margin-bottom:24px;">
                        <label for="${this.roomId}IntentionInput" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Your Intention</label>
                        <input type="text" id="${this.roomId}IntentionInput"
                               aria-label="Set your intention for this session"
                               placeholder="e.g., Finish proposal, Code feature..."
                               style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                    </div>

                    <div style="margin-bottom:24px;">
                        <label id="${this.roomId}CategoryLabel" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Category</label>
                        <div id="${this.roomId}CategoryTiles" role="radiogroup" aria-labelledby="${this.roomId}CategoryLabel" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                            ${Object.entries(this.CATEGORIES).map(([e,i],o)=>`
                            <button type="button" data-action="selectCategory" data-cat="${e}"
                                    style="padding:12px;text-align:center;border:2px solid ${o===0?"var(--accent)":"var(--border)"};border-radius:var(--radius-md);background:${o===0?"rgba(139,92,246,0.12)":"var(--surface)"};cursor:pointer;font-size:13px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                ${i.icon} ${i.label.charAt(0)+i.label.slice(1).toLowerCase()}
                            </button>`).join("")}
                        </div>
                    </div>

                    <div style="margin-bottom:24px;">
                        <label id="${this.roomId}DurationLabel" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Duration</label>
                        <div id="${this.roomId}DurationTiles" role="radiogroup" aria-labelledby="${this.roomId}DurationLabel" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                            ${[25,50,90].map((e,i)=>`
                            <button type="button" data-action="selectDuration" data-dur="${e}"
                                    style="padding:12px;text-align:center;border:2px solid ${i===0?"var(--accent)":"var(--border)"};border-radius:var(--radius-md);background:${i===0?"rgba(139,92,246,0.12)":"var(--surface)"};cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                ${e} min
                            </button>`).join("")}
                            <button type="button" data-action="selectDuration" data-dur="custom"
                                    style="padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                Custom
                            </button>
                        </div>
                        <div id="${this.roomId}CustomDurationDiv" style="display:none;margin-top:12px;">
                            <label for="${this.roomId}CustomMinutes" style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:4px;">Custom duration (minutes)</label>
                            <input type="number" id="${this.roomId}CustomMinutes"
                                   placeholder="Minutes (1–180)" min="1" max="180"
                                   style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                        </div>
                    </div>

                    <button type="button" data-action="confirmSetup"
                            style="width:100%;padding:14px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Start Session
                    </button>
                </div>
            </div>
        </div>`}getActions(){return{...super.getActions(),toggleDimMode:()=>this.toggleDimMode(),toggleChatPanel:()=>this._toggleChatPanel(),changeStatus:e=>this.changeStatus(this._actionEl(e).dataset.status),closeSetupModal:()=>this.closeSetupModal(),selectCategory:e=>this.selectCategory(this._actionEl(e).dataset.cat),selectDuration:e=>this.selectDuration(this._actionEl(e).dataset.dur),confirmSetup:()=>this.confirmSetup()}}getInstructions(){return`
            <p><strong>Digital Nomads Deep Work space.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Set your intention and duration, then click Begin</li>
                <li>Pause → automatically switches to Break (chat unlocks)</li>
                <li>Continue → restores your previous focus mode</li>
                <li>Or switch modes manually using the status buttons</li>
            </ul>
            <h3>Focus Levels:</h3>
            <ul>
                <li>🎯 <strong>Deep Focus</strong> - Maximum concentration</li>
                <li>✨ <strong>Light Focus</strong> - Gentle background work</li>
                <li>☕ <strong>Break</strong> - Recharge and connect</li>
            </ul>
            <h3>Tips:</h3>
            <ul>
                <li>Pomodoro: 25–50 min work, 5–15 min break</li>
                <li>Chat only available during Break mode</li>
                <li>Use 🌙 Dim to reduce distractions</li>
            </ul>`}}Object.assign(Se.prototype,dt);Object.assign(Se.prototype,lt);Object.assign(Se.prototype,Me);const Jt=new Se;window.DeepWorkRoom=Jt;var tt;(tt=window.dispatchRoomReady)==null||tt.call(window,"deepwork");class ut extends L{constructor(){super({roomId:"campfire",roomType:"always-open",name:"Community Campfire",icon:"🔥",description:"A warm space to share, reflect, and connect with the community. Pull up a chair. Real conversations, real people, real connection.",energy:"Social",imageUrl:"/Community/Campfire.webp",participants:12}),this.initChatState(["main"])}onEnter(){this.loadRoomChatFromDB("main"),this._injectSenderAvatar("main")}getHeaderGradient(){return"background:linear-gradient(135deg,rgba(234,88,12,0.1) 0%,rgba(251,146,60,0.05) 100%);"}getParticipantText(){return`${this.state.participants} around the fire`}buildBody(){return`
        <div class="ps-body">
            <main class="campfire-main" aria-label="Community Campfire chat" style="padding:20px;min-width:0;">
                <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
                    <div>
                        <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;">Gather Around the Fire</h4>
                        <div style="display:flex;flex-direction:column;height:auto;">
                            ${this.buildChatContainer("main","Share from the heart...")}
                        </div>
                        <div class="campfire-hint" style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;">
                            💫 Speak from the heart · Listen with presence
                        </div>
                    </div>
                    ${this.buildParticipantSidebarHTML("Around the Fire",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
                </div>
            </main>
        </div>`}getInstructions(){return`
            <p><strong>A warm gathering space for authentic connection.</strong></p>
            <h3>Campfire Values:</h3>
            <ul>
                <li>💫 Share authentically from the heart</li>
                <li>❤️ Listen with presence and care</li>
                <li>🌟 Inspire and uplift each other</li>
                <li>🤝 Connect across all borders</li>
            </ul>
            <h3>What to Share:</h3>
            <ul>
                <li>Reflections from your practice</li>
                <li>Insights and breakthroughs</li>
                <li>Gratitude and appreciation</li>
                <li>Questions and curiosity</li>
                <li>Support and encouragement</li>
            </ul>
            <h3>Guidelines:</h3>
            <ul>
                <li>Be respectful and kind</li>
                <li>Keep it positive and uplifting</li>
                <li>No spam or self-promotion</li>
                <li>Honor everyone's journey</li>
            </ul>`}}Object.assign(ut.prototype,Me);const Xt=new ut;window.CampfireRoom=Xt;var it;(it=window.dispatchRoomReady)==null||it.call(window,"campfire");class He extends L{constructor(){super({roomId:"tarot",roomType:"always-open",name:"Tarot Room",icon:"🔮",description:"Explore the cards, reflect on the messages and share your insights with the community. Guidance, intuition, and community wisdom - one card at a time.",energy:"Intuitive",imageUrl:"/Community/Tarot.webp",participants:8}),this.initChatState(["daily","personal"]),this._tarotDataReady=!1,this._pendingDailyRender=!1,this._interpPurgedToday=!1,this._enrichedCache={},this._personalDataLoaded=!1,this.state.dailyCard=null,this.state.personalDeck=[],this.state.personalDrawn=!1,this.state.currentTab="daily",this._initializeTarotData()}async _initializeTarotData(){this.TAROT_BASE_URL="/Tarot%20Cards%20images/",this.suits=["pentacles","swords","cups","wands"],this.SUIT_NAMES={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},this.COURT_RANKS={11:"Page",12:"Knight",13:"Queen",14:"King"};try{const e=await fetch("/Data/tarot-data.json");if(e.ok){const i=await e.json();this._tarotData=i,this.MAJOR_ARCANA_NAMES={},this.MAJOR_ARCANA_MEANINGS={},i.majorArcana.forEach(o=>{this.MAJOR_ARCANA_NAMES[o.id]=o.name,this.MAJOR_ARCANA_MEANINGS[o.id]=o.upright}),this.MINOR_ARCANA_MEANINGS={},this.COURT_CARD_MEANINGS={},["pentacles","swords","cups","wands"].forEach(o=>{this.MINOR_ARCANA_MEANINGS[o]={},this.COURT_CARD_MEANINGS[o]={},(i.minorArcana[o]||[]).forEach(n=>{this.MINOR_ARCANA_MEANINGS[o][n.number]=n.upright}),(i.courtCards[o]||[]).forEach(n=>{this.COURT_CARD_MEANINGS[o][n.rank]=n.upright})})}else this._loadInlineTarotData()}catch{this._loadInlineTarotData()}this.state.personalDeck=this._buildFullDeck(),this._drawDailyCard(),this._tarotDataReady=!0,this.updateRoomCard(),this._pendingDailyRender&&(this._pendingDailyRender=!1,this._drawAndRenderDaily())}_loadInlineTarotData(){this.MAJOR_ARCANA_NAMES={0:"The Fool",1:"The Magician",2:"The High Priestess",3:"The Empress",4:"The Emperor",5:"The Hierophant",6:"The Lovers",7:"The Chariot",8:"Strength",9:"The Hermit",10:"Wheel of Fortune",11:"Justice",12:"The Hanged Man",13:"Death",14:"Temperance",15:"The Devil",16:"The Tower",17:"The Star",18:"The Moon",19:"The Sun",20:"Judgement",21:"The World"},this.MAJOR_ARCANA_MEANINGS={0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",1:"All the tools are in your hands. You are the bridge between spirit and matter.",2:"Silence holds the answers you seek. Trust your inner knowing.",3:"The Earth mirrors your abundance. Nurture what you love.",4:"True power is built through order and wisdom. Take authority over your life.",5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",9:"Withdraw to reconnect with your light. The answers you seek are within.",10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",11:"The scales always balance in time. Choose integrity.",12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",13:"Endings are beginnings disguised. Transformation renews you into higher truth.",14:"Balance is your sacred art. Patience and moderation bring peace.",15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",16:"When illusion collapses, liberation follows. Trust the breakdown.",17:"Hope returns like light after storm. Believe again in miracles.",18:"The path is unclear but alive with mystery. Feel your way through intuition.",19:"Joy, clarity, and vitality fill your being. Let your light shine.",20:"Awakening through self-realization. Rise into your higher purpose.",21:"Completion, integration, and mastery. Celebrate how far you've come."},this.MINOR_ARCANA_MEANINGS={pentacles:{1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},swords:{1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},cups:{1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Fantasy and illusion. Choose wisely between dreams and reality.",8:"Walking away from what no longer serves. Seeking deeper meaning.",9:"Emotional fulfillment and contentment. Wishes coming true.",10:"Lasting happiness and harmony. Love overflowing in all forms."},wands:{1:"Creative inspiration and new venture. Pure potential ready to ignite.",2:"Planning and vision. The world is yours to explore.",3:"Expansion and foresight. Leadership with strategic thinking.",4:"Celebration and homecoming. Achievement and stability.",5:"Competition and conflict. Challenges that test resolve.",6:"Victory and recognition. Success earned through effort.",7:"Standing your ground. Defense of values and boundaries.",8:"Swift action and momentum. Things moving quickly forward.",9:"Resilience and persistence. Last push before completion.",10:"Burden of responsibility. Strength to carry what must be carried."}},this.COURT_CARD_MEANINGS={pentacles:{Page:"Studious and practical messenger. New opportunities in material realm.",Knight:"Reliable and methodical worker. Steady progress toward goals.",Queen:"Nurturing and prosperous provider. Grounded in abundance.",King:"Master of material world. Wealth through wisdom and patience."},swords:{Page:"Curious and vigilant observer. Mental agility and truth-seeking.",Knight:"Swift and direct communicator. Action driven by intellect.",Queen:"Clear-minded and independent thinker. Wisdom through experience.",King:"Authoritative and analytical leader. Justice and mental mastery."},cups:{Page:"Sensitive and intuitive messenger. Emotional openness and creativity.",Knight:"Romantic and idealistic dreamer. Following the heart's calling.",Queen:"Compassionate and emotionally intelligent. Nurturing through love.",King:"Emotionally balanced and wise. Mastery of feelings and relationships."},wands:{Page:"Enthusiastic and adventurous explorer. Creative spark and potential.",Knight:"Passionate and impulsive adventurer. Bold action and courage.",Queen:"Confident and charismatic leader. Warmth and determination.",King:"Visionary and inspirational leader. Creative mastery and enterprise."}}}_seededRng(e){let i=e>>>0;return function(){i+=1831565813;let o=Math.imul(i^i>>>15,1|i);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}_todaySeed(){const e=new Date;return e.getFullYear()*1e4+(e.getMonth()+1)*100+e.getDate()}_drawDailyCard(){const e=this._buildFullDeck(),i=this._seededRng(this._todaySeed());this.state.dailyCard=e[Math.floor(i()*e.length)]}_drawAndRenderDaily(){this._drawDailyCard();const e=document.getElementById(`${this.roomId}DailyCardContainer`);e&&this.state.dailyCard&&(e.innerHTML=this._buildCardDisplay(this.state.dailyCard));const i=document.getElementById(`${this.roomId}EnrichedSections`);i&&this.state.dailyCard&&(i.innerHTML=this._getEnrichedHTML(this.state.dailyCard,!0)),requestAnimationFrame(()=>this._loadInterpretations())}_buildFullDeck(){return[...Array.from({length:22},(e,i)=>({type:"major",number:i,suit:"major"})),...this.suits.flatMap(e=>Array.from({length:14},(i,o)=>({type:o<10?"minor":"court",number:o+1,suit:e})))]}_shuffleDeck(e){const i=[...e];for(let o=i.length-1;o>0;o--){const n=Math.floor(Math.random()*(o+1));[i[o],i[n]]=[i[n],i[o]]}return i}getCardName(e,i="major"){var o;return i==="major"?((o=this.MAJOR_ARCANA_NAMES)==null?void 0:o[e])??"The Fool":e<=10?`${e} of ${this.SUIT_NAMES[i]}`:`${this.COURT_RANKS[e]} of ${this.SUIT_NAMES[i]}`}getCardMeaning(e,i="major"){var o,n,r,a,s;return i==="major"?((o=this.MAJOR_ARCANA_MEANINGS)==null?void 0:o[e])??"":e<=10?((r=(n=this.MINOR_ARCANA_MEANINGS)==null?void 0:n[i])==null?void 0:r[e])??"":((s=(a=this.COURT_CARD_MEANINGS)==null?void 0:a[i])==null?void 0:s[this.COURT_RANKS[e]])??""}getCardData(e,i="major"){if(!this._tarotData)return null;if(i==="major")return this._tarotData.majorArcana.find(n=>n.id===e)??null;if(e<=10)return(this._tarotData.minorArcana[i]??[]).find(n=>n.number===e)??null;const o=this.COURT_RANKS[e];return(this._tarotData.courtCards[i]??[]).find(n=>n.rank===o)??null}getCardImage(e,i="major"){const o=String(e).padStart(2,"0");if(i==="major")return`${this.TAROT_BASE_URL}${o}-${this.getCardName(e,"major").replace(/\s+/g,"")}.webp`;const n=i.charAt(0).toUpperCase()+i.slice(1);return`${this.TAROT_BASE_URL}${n}${o}.webp`}_buildCardDisplay(e){const i=this.getCardData(e.number,e.suit),o=(i==null?void 0:i.title)??"";return`
        <picture style="display:contents;">
          <source srcset="${this.getCardImage(e.number,e.suit)}" type="image/webp">
          <img width="280" height="480" loading="lazy" decoding="async" src="${this.getCardImage(e.number,e.suit).replace(".webp",".jpg")}"
               style="width:min(280px,100%);height:auto;border-radius:12px;box-shadow:var(--shadow);display:block;"
               alt="${this.getCardName(e.number,e.suit)}"
               loading="lazy" decoding="async"
               onerror="this.src='${this.TAROT_BASE_URL}CardBacks.webp'">
        </picture>
        <h4 style="font-family:var(--serif);font-size:20px;margin:12px 0 4px;text-align:center;">${this.getCardName(e.number,e.suit)}</h4>
        ${o?`<p style="font-family:var(--serif);font-size:16px;font-weight:700;color:var(--text);text-align:center;margin:0;letter-spacing:.01em;">${o}</p>`:""}`}_getEnrichedHTML(e,i=!0){const o=`${e.suit}-${e.number}-${i}`;return this._enrichedCache[o]||(this._enrichedCache[o]=this._buildEnrichedSections(e,i)),this._enrichedCache[o]}_buildEnrichedSections(e,i=!0){const o=this.getCardData(e.number,e.suit);if(!o)return"";const n={pentacles:"Earth",swords:"Air",cups:"Water",wands:"Fire"},r={pentacles:"Physical",swords:"Mental",cups:"Emotional",wands:"Spiritual"},a={Air:"Air",Fire:"Fire",Water:"Water",Earth:"Earth"};let s=null,l=null;e.suit==="major"?s=a[o.correspondence]??null:(s=n[e.suit]??null,l=r[e.suit]??null);const d=(o.keywords||[]).map(g=>`<span style="display:inline-block;padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--text-muted);margin:3px 4px;white-space:nowrap;">${g}</span>`).join(""),c=[];o.astrology&&o.astrology!=="-"&&c.push({label:"Astrology",value:o.astrology}),s&&c.push({label:"Element",value:s}),l&&c.push({label:"Aspect",value:l}),o.treeOfLife&&c.push({label:"Tree of Life",value:o.treeOfLife});const p=c.map(g=>`
            <div style="text-align:center;min-width:80px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px;font-weight:700;">${g.label}</div>
                <div style="font-size:13px;font-weight:500;">${g.value}</div>
            </div>`).join(""),h=(o.symbols||[]).map(g=>`<li style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;">${g}</li>`).join(""),m=this.roomId;return`
        <!-- ── Attributes & Meaning ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            ${o.narrative?`
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:10px;">Represents</div>
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--text-muted);max-width:560px;margin:0 auto;">
                    ${o.narrative}
                </p>
            </div>`:""}
            ${d?`
            <div style="margin-bottom:20px;${o.narrative?"padding-top:20px;border-top:1px solid var(--border);":""}">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;text-align:center;margin-bottom:8px;">Keywords</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;">${d}</div>
            </div>`:""}
            ${p?`
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:20px;">
                ${p}
            </div>`:""}

            <!-- UPRIGHT / REVERSED TOGGLE -->
            <div style="display:flex;justify-content:center;gap:8px;margin-bottom:16px;">
                <button id="${m}UprightBtn"
                    onclick="window.TarotRoom._setMeaningTab('upright')"
                    style="padding:7px 20px;border-radius:20px;border:1px solid var(--accent);background:var(--accent);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">
                    Upright
                </button>
                <button id="${m}ReversedBtn"
                    onclick="window.TarotRoom._setMeaningTab('reversed')"
                    style="padding:7px 20px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;">
                    Reversed
                </button>
            </div>
            <div id="${m}MeaningText" style="text-align:center;font-size:15px;line-height:1.7;max-width:560px;margin:0 auto;">
                ${o.upright||""}
            </div>
            <div id="${m}MeaningTextReversed" style="display:none;text-align:center;font-size:15px;line-height:1.7;max-width:560px;margin:0 auto;color:var(--text-muted);">
                ${o.reversed||""}
            </div>

            ${h?`
            <details style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span style="display:inline-block;">▶</span> Symbols Guide
                </summary>
                <ul style="margin:12px 0 0 0;padding:0 0 0 4px;list-style:none;">
                    ${h}
                </ul>
            </details>`:""}
        </div>

        <!-- ── Today's Question ── -->
        ${o.mysticalQuestion||o.dailyQuestion?`
        <div style="background:var(--surface);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px;">🔮 Today's Question</div>
            ${o.dailyQuestion?`<p style="font-family:var(--serif);font-size:17px;line-height:1.7;margin:0 auto;max-width:520px;">${o.dailyQuestion}</p>`:""}
            ${o.mysticalQuestion?`<p style="font-size:13px;color:var(--text-muted);margin:10px auto 0;max-width:480px;font-style:italic;">Mystical: ${o.mysticalQuestion}</p>`:""}
        </div>`:""}

        <!-- ── Card Journal ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;">📓 Card Journal</div>
                <button onclick="window.TarotRoom._toggleJournalLog()"
                    id="${m}JournalLogBtn"
                    style="font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;font-weight:600;">View Log</button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 14px 0;line-height:1.6;">
                Look closely at the card. What do you notice? Describe what you see — the characters, their posture, expression, actions. What colors stand out? Any symbols, objects, or small details that catch your eye? How does it make you feel?
            </p>
            <div id="${m}JournalForm">
                <textarea id="${m}JournalInput"
                    placeholder="e.g. A figure stands at the edge of a cliff, looking up… the colors feel warm and golden… I notice a small dog at their feet…"
                    style="width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;line-height:1.6;resize:vertical;min-height:110px;font-family:inherit;"
                ></textarea>
                <button onclick="window.TarotRoom._saveJournalEntry()"
                    style="margin-top:10px;padding:9px 22px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;">
                    Save to Journal
                </button>
            </div>
            <div id="${m}JournalLog" style="display:none;">
                <div id="${m}JournalLogList" style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;"></div>
            </div>
        </div>

        ${i?`
        <!-- ── Community Interpretations ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">🌀 Community Interpretations</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px 0;">Share a one-line interpretation of today's card.</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
                <input id="${m}InterpInput" type="text" maxlength="140"
                    aria-label="Your interpretation of this card"
                    placeholder="One line — what does this card say to you today?"
                    style="flex:1;min-width:0;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;font-family:inherit;"
                    onkeydown="if(event.key==='Enter')window.TarotRoom._submitInterpretation()"
                />
                <button onclick="window.TarotRoom._submitInterpretation()"
                    style="padding:9px 18px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                    Share
                </button>
            </div>
            <div id="${m}InterpList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;">
                <div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading interpretations…</div>
            </div>
        </div>
        `:""}`}_setMeaningTab(e){const i=document.getElementById(`${this.roomId}UprightBtn`),o=document.getElementById(`${this.roomId}ReversedBtn`),n=document.getElementById(`${this.roomId}MeaningText`),r=document.getElementById(`${this.roomId}MeaningTextReversed`);i&&(e==="upright"?(i.style.background="var(--accent)",i.style.color="#fff",i.style.borderColor="var(--accent)",o.style.background="transparent",o.style.color="var(--text-muted)",o.style.borderColor="var(--border)",n.style.display="",r.style.display="none"):(o.style.background="var(--accent)",o.style.color="#fff",o.style.borderColor="var(--accent)",i.style.background="transparent",i.style.color="var(--text-muted)",i.style.borderColor="var(--border)",n.style.display="none",r.style.display=""))}_toggleJournalLog(){const e=document.getElementById(`${this.roomId}JournalLog`),i=document.getElementById(`${this.roomId}JournalForm`),o=document.getElementById(`${this.roomId}JournalLogBtn`);if(!e)return;const n=e.style.display!=="none";e.style.display=n?"none":"",i.style.display=n?"":"none",o.textContent=n?"View Log":"Write Entry",n||this._loadJournalLog()}async _saveJournalEntry(){var a;const e=document.getElementById(`${this.roomId}JournalInput`),i=(a=e==null?void 0:e.value)==null?void 0:a.trim();if(!i){window.Core.showToast("Please write something first");return}const o=window.Core.state.currentUser,n=this.state.dailyCard,r=new Date().toISOString().slice(0,10);try{await u._sb.from("tarot_reflections").insert({user_id:o==null?void 0:o.id,card_key:`${n.suit}-${n.number}`,card_name:this.getCardName(n.number,n.suit),date:r,reflection:i}),e.value="",window.Core.showToast("Saved to your journal ✨")}catch(s){console.warn("[TarotRoom] journal save failed",s),window.Core.showToast("Could not save — please try again")}}async _loadJournalLog(){const e=window.Core.state.currentUser,i=document.getElementById(`${this.roomId}JournalLogList`);if(!(!i||!(e!=null&&e.id))){i.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>';try{const{data:o,error:n}=await u._sb.from("tarot_reflections").select("id, card_name, date, reflection").eq("user_id",e.id).order("created_at",{ascending:!1}).limit(30);if(n)throw n;if(!o||o.length===0){i.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">No journal entries yet.</div>';return}i.innerHTML=o.map(r=>`
                <div id="jr-${r.id}" style="background:var(--background);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:600;color:var(--accent);">${this._escapeHtml(r.card_name||"")} · ${r.date}</span>
                        <div style="display:flex;gap:10px;">
                            <button onclick="window.TarotRoom._editJournalEntry('${r.id}')" style="font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">Edit</button>
                            <button onclick="window.TarotRoom._deleteJournalEntry('${r.id}')" style="font-size:12px;color:#e57373;background:none;border:none;cursor:pointer;padding:0;">Delete</button>
                        </div>
                    </div>
                    <div id="jr-text-${r.id}" style="font-size:14px;line-height:1.6;color:var(--text);">${this._escapeHtml(r.reflection)}</div>
                    <div id="jr-edit-${r.id}" style="display:none;">
                        <textarea style="width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;line-height:1.5;resize:vertical;min-height:80px;font-family:inherit;margin-top:8px;">${this._escapeHtml(r.reflection)}</textarea>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button onclick="window.TarotRoom._saveEditedEntry('${r.id}')" style="padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;">Save</button>
                            <button onclick="window.TarotRoom._cancelEditEntry('${r.id}')" style="padding:5px 14px;background:none;border:1px solid var(--border);border-radius:var(--radius-md);font-size:13px;cursor:pointer;color:var(--text-muted);">Cancel</button>
                        </div>
                    </div>
                </div>`).join("")}catch(o){console.warn("[TarotRoom] load journal failed",o),i.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load journal.</div>'}}}_editJournalEntry(e){var i,o;(i=document.getElementById(`jr-text-${e}`))!=null&&i.style&&(document.getElementById(`jr-text-${e}`).style.display="none"),(o=document.getElementById(`jr-edit-${e}`))!=null&&o.style&&(document.getElementById(`jr-edit-${e}`).style.display="")}_cancelEditEntry(e){var i,o;(i=document.getElementById(`jr-text-${e}`))!=null&&i.style&&(document.getElementById(`jr-text-${e}`).style.display=""),(o=document.getElementById(`jr-edit-${e}`))!=null&&o.style&&(document.getElementById(`jr-edit-${e}`).style.display="none")}async _saveEditedEntry(e){var r;const i=document.getElementById(`jr-edit-${e}`),o=i==null?void 0:i.querySelector("textarea"),n=(r=o==null?void 0:o.value)==null?void 0:r.trim();if(n)try{await u._sb.from("tarot_reflections").update({reflection:n}).eq("id",e);const a=document.getElementById(`jr-text-${e}`);a&&(a.textContent=n),this._cancelEditEntry(e),window.Core.showToast("Entry updated")}catch(a){console.warn("[TarotRoom] edit failed",a),window.Core.showToast("Could not update entry")}}async _deleteJournalEntry(e){var i;try{await u._sb.from("tarot_reflections").delete().eq("id",e),(i=document.getElementById(`jr-${e}`))==null||i.remove(),window.Core.showToast("Entry deleted")}catch(o){console.warn("[TarotRoom] delete failed",o),window.Core.showToast("Could not delete entry")}}async _submitInterpretation(){var a;const e=document.getElementById(`${this.roomId}InterpInput`),i=(a=e==null?void 0:e.value)==null?void 0:a.trim();if(!i)return;const o=window.Core.state.currentUser,n=this.state.dailyCard,r=new Date().toISOString().slice(0,10);try{await u._sb.from("tarot_interpretations").insert({user_id:o==null?void 0:o.id,display_name:(o==null?void 0:o.display_name)||(o==null?void 0:o.username)||"A seeker",card_key:`${n.suit}-${n.number}`,date:r,interpretation:i}),e.value="",await this._loadInterpretations(),window.Core.showToast("Shared 🌀")}catch(s){console.warn("[TarotRoom] interpretation save failed",s),window.Core.showToast("Could not share — please try again")}}async _loadInterpretations(){const e=this.state.dailyCard,i=new Date().toISOString().slice(0,10),o=document.getElementById(`${this.roomId}InterpList`);if(!(!o||!e)){this._interpPurgedToday||(this._interpPurgedToday=!0,u._sb.from("tarot_interpretations").delete().lt("date",i).then(()=>{}));try{const{data:n,error:r}=await u._sb.from("tarot_interpretations").select("display_name, interpretation, created_at").eq("card_key",`${e.suit}-${e.number}`).eq("date",i).order("created_at",{ascending:!1}).limit(50);if(r)throw r;if(!n||n.length===0){o.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Be the first to share an interpretation.</div>';return}o.innerHTML=n.map(a=>`
                <div style="display:flex;gap:10px;align-items:baseline;padding:8px 10px;background:var(--background);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <span style="font-size:12px;font-weight:600;color:var(--accent);white-space:nowrap;flex-shrink:0;">${this._escapeHtml(a.display_name)}</span>
                    <span style="font-size:14px;line-height:1.5;color:var(--text);">${this._escapeHtml(a.interpretation)}</span>
                </div>`).join("")}catch(n){console.warn("[TarotRoom] load interpretations failed",n),o.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load interpretations.</div>'}}}onPersonalTabEnter(){this._personalDataLoaded||(this._loadDrawHistory(),this._loadMastery())}drawPersonalCard(){["Major","Minor","Court"].forEach(i=>{const o=document.getElementById(`${this.roomId}${i}Select`);o&&(o.value="")});const e=this._shuffleDeck(this.state.personalDeck);this._renderPersonalCard(e[0])}_renderPersonalCard(e){const i=document.getElementById(`${this.roomId}PersonalCardContainer`),o=document.getElementById(`${this.roomId}PersonalEnrichedSections`);i&&(i.innerHTML=this._buildCardDisplay(e)),o&&(o.innerHTML=this._getEnrichedHTML(e,!1)),i==null||i.scrollIntoView({behavior:"smooth",block:"start"}),this._logDraw(e),this._personalDataLoaded=!1,this.state.currentTab==="personal"&&(this._loadDrawHistory(),this._loadMastery())}_cardKey(e){return e.suit==="major"?`major-${e.number}`:e.number<=10?`minor-${e.number}-${e.suit}`:`court-${e.number}-${e.suit}`}async _logDraw(e){var r,a;if(!u._sb)return;const i=(a=(r=window.Core)==null?void 0:r.state)==null?void 0:a.currentUser;if(!(i!=null&&i.id))return;const o=this.getCardName(e.number,e.suit),n=e.suit==="major"?"major":e.number<=10?"minor":"court";try{await u._sb.from("tarot_draws").insert({user_id:i.id,card_key:this._cardKey(e),card_name:o,card_type:n})}catch(s){console.warn("[TarotRoom] logDraw failed",s)}}async _loadDrawHistory(){var o,n;const e=document.getElementById(`${this.roomId}DrawHistory`);if(!e||!u._sb)return;const i=(n=(o=window.Core)==null?void 0:o.state)==null?void 0:n.currentUser;if(i!=null&&i.id)try{const{data:r}=await u._sb.from("tarot_draws").select("card_name, card_type, drawn_at").eq("user_id",i.id).order("drawn_at",{ascending:!1}).limit(50);if(!(r!=null&&r.length)){e.innerHTML='<span style="color:var(--text-muted);font-size:13px;">No cards drawn yet.</span>';return}const a={major:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>',minor:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',court:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><path d="M2 20h20"/><path d="m4 14 4-8 4 8 4-8 4 8"/></svg>'};e.innerHTML=r.map(s=>{const l=new Date(s.drawn_at).toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"}),d=new Date(s.drawn_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:16px;">${a[s.card_type]||"🃏"}</span>
                        <span style="font-size:14px;font-weight:500;">${this._escapeHtml(s.card_name)}</span>
                    </div>
                    <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${l} · ${d}</span>
                </div>`}).join(""),this._personalDataLoaded=!0}catch(r){console.warn("[TarotRoom] loadDrawHistory failed",r)}}async _loadMastery(){var r,a;const e=document.getElementById(`${this.roomId}MasteryCount`),i=document.getElementById(`${this.roomId}MasteryProgress`),o=document.getElementById(`${this.roomId}MasteryCards`);if(!e||!u._sb)return;const n=(a=(r=window.Core)==null?void 0:r.state)==null?void 0:a.currentUser;if(n!=null&&n.id)try{const{data:s}=await u._sb.from("tarot_draws").select("card_key").eq("user_id",n.id).eq("card_type","major"),l=new Set((s||[]).map(h=>h.card_key)),d=22,c=l.size,p=Math.round(c/d*100);if(e&&(e.textContent=`${c} / ${d}`),i&&(i.style.width=`${p}%`),o){const h=this.MAJOR_ARCANA_NAMES||{};o.innerHTML=Object.entries(h).map(([m,g])=>{const f=`major-${m}`,b=l.has(f);return`<span style="padding:3px 8px;border-radius:12px;font-size:12px;border:1px solid var(--border);
                        background:${b?"var(--neuro-accent)":"transparent"};
                        color:${b?"white":"var(--text-muted)"};
                        opacity:${b?"1":"0.6"};"
                        title="${g}">${b?"✓ ":""}${g}</span>`}).join("")}}catch(s){console.warn("[TarotRoom] loadMastery failed",s)}}async _clearDrawHistory(){var i,o;if(!u._sb)return;const e=(o=(i=window.Core)==null?void 0:i.state)==null?void 0:o.currentUser;if(e!=null&&e.id&&confirm("Clear your entire draw history? This cannot be undone."))try{await u._sb.from("tarot_draws").delete().eq("user_id",e.id),this._personalDataLoaded=!1,this._loadDrawHistory(),this._loadMastery(),window.Core.showToast("Draw history cleared")}catch(n){console.warn("[TarotRoom] clearDrawHistory failed",n)}}onEnter(){this.state.personalDeck.length||(this.state.personalDeck=this._buildFullDeck()),this._tarotDataReady?this._drawAndRenderDaily():this._pendingDailyRender=!0,this.initializeChat(),requestAnimationFrame(()=>{var e;return(e=document.querySelector(`#${this.roomId}View .tarot-main`))==null?void 0:e.scrollTo(0,0)})}getParticipantText(){return`${this.state.participants} seeking guidance`}buildCardFooter(){const e=this.state.dailyCard,i=e?this.getCardName(e.number,e.suit):null;return`
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
            ${i?`<span style="font-size:11px;color:var(--text-muted);">Daily Card: <strong style="color:var(--text);font-weight:600;">${i}</strong></span>`:""}
        </div>`}buildBody(){return`
        <div class="ps-body" style="display:flex;">
            <main class="tarot-main" style="flex:1;padding:24px;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;">
                <div style="width:100%;">
                    ${this.buildTabNav('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg> Daily Community Card','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="14" height="18" rx="2"/></svg> Solo Card Learning')}
                    <div id="${this.roomId}DailyTab"    style="display:block;">${this._buildDailyTab()}</div>
                    <div id="${this.roomId}PersonalTab" style="display:none;">${this._buildPersonalTab()}</div>
                </div>
            </main>
        </div>`}_buildDailyTab(){return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px 16px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg> Daily Community Card</h3>
            <div id="${this.roomId}DailyCardContainer" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
                <div style="color:var(--text-muted);font-size:14px;padding:40px;">Loading today's card…</div>
            </div>
        </div>
        <div id="${this.roomId}EnrichedSections"></div>
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
            <div>
                <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Community Discussion</h4>
                <div style="display:flex;flex-direction:column;height:100%;">
                    ${this.buildChatContainer("daily","Share your thoughts on today's card...")}
                </div>
            </div>
            ${this.buildParticipantSidebarHTML("Online Practitioners",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
        </div>`}_buildPersonalTab(){const e=this.roomId,i=Object.entries(this.MAJOR_ARCANA_NAMES||{}).map(([c,p])=>`<option value="major:${c}">${p}</option>`).join(""),o=["pentacles","swords","cups","wands"],n={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},r={1:"Ace",2:"Two",3:"Three",4:"Four",5:"Five",6:"Six",7:"Seven",8:"Eight",9:"Nine",10:"Ten"},a=o.map(c=>`<optgroup label="${n[c]}">${Array.from({length:10},(p,h)=>h+1).map(p=>`<option value="minor:${p}:${c}">${r[p]} of ${n[c]}</option>`).join("")}</optgroup>`).join(""),s={11:"Page",12:"Knight",13:"Queen",14:"King"},l=o.map(c=>`<optgroup label="${n[c]}">${Object.entries(s).map(([p,h])=>`<option value="court:${p}:${c}">${h} of ${n[c]}</option>`).join("")}</optgroup>`).join(""),d="width:100%;padding:10px 12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;cursor:pointer;";return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 24px 0;text-align:center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="14" height="18" rx="2"/></svg>
                Solo Card Learning
            </h3>

            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;">
                <div>
                    <label style="font-weight:700;font-size:15px;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Major Arcana</label>
                    <select id="${e}MajorSelect" style="${d}"
                            data-action="personalSelectChange" data-source="major">
                        <option value="">— Select —</option>
                        ${i}
                    </select>
                </div>
                <div>
                    <label style="font-weight:700;font-size:15px;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Minor Arcana</label>
                    <select id="${e}MinorSelect" style="${d}"
                            data-action="personalSelectChange" data-source="minor">
                        <option value="">— Select —</option>
                        ${a}
                    </select>
                </div>
                <div>
                    <label style="font-weight:700;font-size:15px;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><path d="M2 20h20"/><path d="m4 14 4-8 4 8 4-8 4 8"/></svg> Court Cards</label>
                    <select id="${e}CourtSelect" style="${d}"
                            data-action="personalSelectChange" data-source="court">
                        <option value="">— Select —</option>
                        ${l}
                    </select>
                </div>
            </div>

            <div style="text-align:center;margin-bottom:24px;">
                <button type="button" data-action="drawPersonalCard"
                        style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light));color:white;border:none;border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:15px;letter-spacing:0.5px;box-shadow:var(--shadow-raised);">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg> Random Draw
                </button>
            </div>

            <div id="${e}PersonalCardContainer" style="display:flex;flex-direction:column;align-items:center;"></div>
            <div id="${e}PersonalEnrichedSections"></div>

            <div style="margin-top:32px;display:flex;flex-direction:column;gap:20px;">
                <!-- Mastery Tracker -->
                <div style="border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px;background:var(--background);">
                    <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Major Arcana Mastery</h4>
                    <div id="${e}MasteryBar" style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
                            <span>Cards Discovered</span>
                            <span id="${e}MasteryCount">Loading…</span>
                        </div>
                        <div style="height:8px;border-radius:4px;background:var(--border);overflow:hidden;">
                            <div id="${e}MasteryProgress" style="height:100%;border-radius:4px;background:linear-gradient(90deg,var(--neuro-accent),var(--neuro-accent-light));width:0%;transition:width 0.5s ease;"></div>
                        </div>
                    </div>
                    <div id="${e}MasteryCards" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;">
                        <span style="color:var(--text-muted);font-size:13px;">Loading…</span>
                    </div>
                </div>

                <!-- Draw History -->
                <div style="border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px;background:var(--background);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <h4 style="font-family:var(--serif);font-size:18px;margin:0;display:flex;align-items:center;gap:8px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg> Cards You've Drawn</h4>
                        <button type="button" data-action="clearDrawHistory" style="font-size:12px;color:var(--text-muted);background:none;border:1px solid var(--border);border-radius:var(--radius-md);padding:4px 10px;cursor:pointer;">Clear History</button>
                    </div>
                    <div id="${e}DrawHistory" style="max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
                        <span style="color:var(--text-muted);font-size:13px;">No cards drawn yet.</span>
                    </div>
                </div>
            </div>
        </div>`}_onPersonalSelectChange(e){const i=this.roomId;["Major","Minor","Court"].forEach(a=>{if(a.toLowerCase()!==e){const s=document.getElementById(`${i}${a}Select`);s&&(s.value="")}});const o=document.getElementById(`${i}${e.charAt(0).toUpperCase()+e.slice(1)}Select`);if(!(o!=null&&o.value))return;const n=o.value.split(":");let r;n[0]==="major"?r={type:"major",number:parseInt(n[1]),suit:"major"}:n[0]==="minor"?r={type:"minor",number:parseInt(n[1]),suit:n[2]}:r={type:"court",number:parseInt(n[1]),suit:n[2]},this._renderPersonalCard(r)}getActions(){return{...super.getActions(),drawPersonalCard:()=>this.drawPersonalCard(),clearDrawHistory:()=>this._clearDrawHistory(),personalSelectChange:e=>this._onPersonalSelectChange(this._actionEl(e).dataset.source)}}getInstructions(){return`
            <p><strong>Daily guidance and personal card draws with community reflection.</strong></p>
            <h3>Two Types of Draws:</h3>
            <ul>
                <li>🌅 <strong>Daily Card</strong> - One shared card for the entire community each day. Resets at midnight.</li>
                <li>✨ <strong>Personal Draw</strong> - Your own card for specific questions.</li>
            </ul>
            <h3>How to Approach:</h3>
            <ul>
                <li>Approach with an open heart and curious mind</li>
                <li>There are no "bad" cards - only lessons and perspectives</li>
                <li>Your intuition matters more than memorized meanings</li>
                <li>Reflect deeply before sharing with the community</li>
            </ul>
            <h3>Guidelines:</h3>
            <ul>
                <li>Honor the sacred nature of divination</li>
                <li>Be respectful of others' interpretations</li>
                <li>Keep reflections authentic and thoughtful</li>
                <li>Avoid fortune-telling or predictions for others</li>
            </ul>`}}Object.assign(He.prototype,Me);Object.assign(He.prototype,ct);const Zt=new He;window.TarotRoom=Zt;var ot;(ot=window.dispatchRoomReady)==null||ot.call(window,"tarot");class Oe extends L{constructor(){super({roomId:"reiki",roomType:"always-open",name:"Reiki Chakra Room",icon:"✨",description:"Daily chakra energy work aligned with the planetary cycle. Tune into your energy. Heal, balance, and flow.",energy:"Healing",imageUrl:"/Community/Reiki.webp",participants:15}),this.initChatState(["daily","personal"]),this._chakraDataReady=!1,this._energyPurgedToday=!1,this._chakraDisplayCache={},this._masteryLoaded=!1,this.state.currentDay=null,this.state.personalFocus=null,this.state.dailyImageIndex=0,this.state.personalImageIndex=0,this.state.currentTab="daily",this._initializeChakraData()}async _initializeChakraData(){this.DAY_MAP=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];try{const e=await fetch("/Data/chakra-data.json");e.ok?this.CHAKRA_SCHEDULE=await e.json():this._loadInlineChakraData()}catch{this._loadInlineChakraData()}this.state.currentDay=this.DAY_MAP[new Date().getDay()],this._buildChakraOptions(),this._chakraDataReady=!0,this.updateRoomCard()}_loadInlineChakraData(){this.CHAKRA_SCHEDULE={Monday:{key:"sacral",name:"Sacral Chakra - Svadhisthana",planet:"🌙 Moon",color:"Orange",theme:"Emotional flow, creativity, softness",element:"Water",sense:"Taste",symbol:"Lotus with 6 petals",endocrineGland:"Gonads (Sex glands)",bodyAreas:"Ovaries, testes, prostate, sexual organs, spleen, uterus, urinary bladder",location:"Two fingers below the navel.",visualization:"Sunrise, swimming in pure natural waters on full moon",keywords:["Emotions","creativity","flow","sexuality","relationships","self-worth","desires","empathy"],roleAndPurpose:"The second chakra is the center of our emotions and creativity. Through it, we begin to understand our responses to both our internal and external worlds. From here, we create through emotion and express it creatively to the outside world.",commonIssues:["Emotional repression","Dependency on others","Creative blocks","Kidney problems","Fertility issues"],fundamentalTruths:["I feel!","Honor your neighbors!"],guidedReflections:["Do I allow myself to fully feel my emotions, or do I suppress them to appear in control?","In what areas of life do I resist flow and spontaneity, and why?","How often do I create for the joy of creating, rather than for validation or outcome?"],image:"/Community/Chakras/Svadhistana1.webp",image2:"/Community/Chakras/Svadhistana2.webp",practice:["Gentle hip circles for 1 minute","Place hand on lower abdomen, breathe softly","Drink water slowly, noticing sensation","Move freely to music for 2 minutes","Write one sentence about how you feel right now","Stretch hips or lower back gently","Smile intentionally and hold it for 30 seconds","Take a warm shower mindfully","Name one thing you enjoy today","Say: I allow myself to feel"],practice2:["Rock pelvis forward and back while seated","Place warm hands on lower belly","Draw a simple shape or doodle","Notice one pleasant sensation in your body","Roll shoulders in slow circles","Stretch inner thighs lightly","Breathe into hips and lower back","Allow one emotion without judging it","Move hands like water for 1 minute","Say: I allow movement and change"],inquiry:"What am I feeling right now without judging it?"},Tuesday:{key:"root",name:"Root Chakra - Muladhara",planet:"♂️ Mars",color:"Bright red",theme:"Grounding, strength, action",element:"Earth",sense:"Smell",symbol:"Lotus with 4 petals",endocrineGland:"Adrenal glands",bodyAreas:"Kidneys, spine, large intestine, legs, bones",location:"At the base of the spine, between the genitals and the anus.",visualization:"Circulating blood, flowing lava at the center of the earth",keywords:["Physical","grounding","survival","security","stability","family","tribe","culture"],roleAndPurpose:"The role of the first chakra is the survival instinct in the physical world. It is connected to our primal emotions and programmed by the family, friends, and society in which we live.",commonIssues:["Addictions and uncontrollable desires","Nervous system problems","Poor blood circulation","Money and career issues"],fundamentalTruths:["I exist!","All is one!"],guidedReflections:["Do I feel safe existing as I am, without needing to prove or justify my worth?","Where in my life do I still operate out of fear of not having enough?","Do I trust life to provide for me, or do I feel I must constantly fight for survival?"],image:"/Community/Chakras/Muladhara1.webp",image2:"/Community/Chakras/Muladhara2.webp",practice:["Stand barefoot and feel your weight for 60 seconds","Slow inhale 4 sec, exhale 6 sec, 5 rounds","Name 3 things you can physically touch right now","Press feet firmly into the floor and tense legs for 10 sec","Eat something warm and simple with full attention","Walk slowly, feeling heel to toe contact","Place hands on lower belly and breathe","Clean or organize one small physical space","Sit and feel your spine connect to the ground","Say out loud: I am here, I am safe"],practice2:["Sit and press your feet into the floor for 30 seconds","Slow walk for 2 minutes without phone","Place a heavy object on your thighs and feel its weight","Eat one bite of food extremely slowly","Touch a solid surface and focus on texture","Stand and shift weight side to side","Tense entire body for 5 sec, release completely","Notice 3 red things around you","Visualize roots growing from your feet","Say: I am grounded and stable"],inquiry:"What concrete action strengthens my life today?"},Wednesday:{key:"throat",name:"Throat Chakra - Vishuddha",planet:"☿ Mercury",color:"Light blue, silver, blue-green",theme:"Truth, expression, clarity",element:"Ether (Space)",sense:"Hearing",symbol:"Lotus with 16 petals",endocrineGland:"Thyroid",bodyAreas:"Throat, bronchi, voice mechanism, lungs, digestive tract, mouth",location:"Throat.",visualization:"Blue clear skies, sky reflections on calm water",keywords:["Truth","courage","voice","communication","judgment","acceptance","trust"],roleAndPurpose:"The fifth chakra is our communication center and the foundation for creating our future and self-protection. Through it, we express our thoughts, feelings, and what we want and need.",commonIssues:['Inability to say "no" or "yes"',"Feeling victimized","Lack of assertiveness","Throat and jaw problems"],fundamentalTruths:["I feel, think, and express with love!","Surrender your will to the divine will!"],guidedReflections:["Do I express my truth openly, or do I censor myself to avoid conflict?","How often do I truly listen — not just hear — what others are saying?","What unspoken truths have been living in my throat, waiting to be released?"],image:"/Community/Chakras/Vissudha1.webp",image2:"/Community/Chakras/Vissudha2.webp",practice:["Take a deep breath and sigh out loud","Hum gently for 1 minute","Speak one honest sentence aloud","Roll shoulders and relax neck","Drink water mindfully","Write one thing you want to say but haven't","Sing one line of a song","Place hand on throat and breathe","Speak slower than usual for one minute","Say: My voice matters"],practice2:["Make any sound for 30 seconds","Gently massage your neck","Write and read aloud one true statement",'Practice saying "no" out loud',"Stretch your jaw wide, then relax","Whisper, then speak normally","Notice when you hold back words","Gargle water mindfully","Speak your name clearly 3 times","Say: I express my truth"],inquiry:"What truth wants to be spoken or written?"},Thursday:{key:"third-eye",name:"Third Eye Chakra - Ajna",planet:"♃ Jupiter",color:"Bright dark blue, transparent indigo",theme:"Intuition, vision, insight",element:"Light",sense:"All senses including supernatural senses",symbol:"Lotus with 96 petals",endocrineGland:"Pituitary",bodyAreas:"Lower brain, left eye, ears, nose, nervous system",location:"Center of the forehead, one finger above the eyebrows.",visualization:"Starry night skies, celestial bodies, galaxies",keywords:["Imagination","visualization","intuition","manifestation","creation","vision"],roleAndPurpose:"The sixth chakra is our center of vision — both inner and outer. Through it, we see reality and broadcast images and visions that represent our reality. It is responsible for our good mood and behavior through influence on hormones secreted in the brain.",commonIssues:["Difficulty planning the future","Underdeveloped imagination","Vision problems","Hormonal imbalance"],fundamentalTruths:["I feel, think, and express my vision with love!","Seek only the truth!"],guidedReflections:["How clearly do I see my life direction right now?","Do I trust my intuition as a valid source of truth, or do I dismiss it?","How connected do I feel to my inner wisdom and higher guidance?"],image:"/Community/Chakras/Ajna1.webp",image2:"/Community/Chakras/Ajna2.webp",practice:["Focus on space between eyebrows","Close eyes and look inward","Trust your intuition on one decision","Meditate in darkness for 5 minutes","Notice synchronicities today","Visualize indigo light at third eye","Ask a question and listen for inner answer","Practice seeing with eyes closed","Trust your first instinct","Say: I see clearly"],practice2:["Gently press center of forehead","Imagine opening inner eye","Write down one intuitive hit","Notice patterns in your life","Practice visualization","Breathe indigo light through third eye","Trust gut feelings","Observe dreams and symbols","Release need to understand everything","Say: My intuition guides me"],inquiry:"What does my intuition know that my mind doesn't?"},Friday:{key:"heart",name:"Heart Chakra - Anahata",planet:"♀ Venus",color:"Bright green, bright pink, gold",theme:"Love, compassion, connection",element:"Air",sense:"Touch",symbol:"Lotus with 12 petals",endocrineGland:"Thymus",bodyAreas:"Heart, circulatory system, arms, hands",location:"Center of the chest, heart area.",visualization:"Green and blooming nature, plant blossoms, pink and endless skies",keywords:["Universal love","compassion","mercy","giving","balance","calm","integration"],roleAndPurpose:"The fourth chakra is our heart center and the point of balance. Its role is to combine the lessons of the other chakras, blend them with universal love and compassion, and radiate this energy outward from a stable place.",commonIssues:["Difficulties in relationships","Inability to give and receive love","Heart problems","Lung problems"],fundamentalTruths:["I feel and think with love!","Love is the divine power!"],guidedReflections:["Do I allow myself to receive love as easily as I give it?","How easily do I forgive myself and others?","What would change if I chose to let love, not fear, guide every decision?"],image:"/Community/Chakras/Anahata1.webp",image2:"/Community/Chakras/Anahata2.webp",practice:["Place both hands on your heart","Take 3 deep breaths into your chest","Think of someone you love","Hug yourself gently","Smile at your reflection","Write one thing you appreciate about yourself","Send a kind message to someone","Stretch arms wide and open chest","Notice something beautiful around you","Say: I am worthy of love"],practice2:["Press palms together at heart center","Breathe green light into chest","Forgive yourself for one small thing","List 3 people/things you're grateful for","Give yourself a compliment out loud","Visualize someone you care about happy","Place hand on heart and feel it beat","Do one act of kindness","Open arms wide and breathe deeply","Say: Love flows through me"],inquiry:"Where can I offer more compassion today - to myself or others?"},Saturday:{key:"crown",name:"Crown Chakra - Sahasrara",planet:"♄ Saturn",color:"Pure white, bright light, purple",theme:"Awareness, unity, transcendence",element:"Beyond element",sense:"Beyond sense",symbol:"Lotus with 1,000 petals",endocrineGland:"Pineal",bodyAreas:"Upper brain, right eye, cerebral cortex, central nervous system",location:"Top of the head, crown of the skull.",visualization:"Peak of a very high snowy mountain",keywords:["Cosmic consciousness","unity","wholeness","transcendence","inspiration","spiritual development"],roleAndPurpose:"The seventh chakra is our divinity center. It centralizes streams of high spiritual energy and our role and mission in this life. It also reminds us that we are one with the source and all spiritual beings.",commonIssues:["Lack of direction","Dizziness","Feelings of disconnection","Deep depression","Learning disabilities"],fundamentalTruths:["I feel, think, and express the vision of a higher purpose with love!","Live in the moment!"],guidedReflections:["How connected do I feel to a higher source or divine presence in my daily life?","Do I trust that my life has a meaningful purpose?","How can I embody the awareness that I am not separate from the universe?"],image:"/Community/Chakras/Sahasrara1.webp",image2:"/Community/Chakras/Sahasrara2.webp",practice:["Sit in silence for 3 minutes","Focus awareness at crown of head","Notice thoughts without following them","Breathe white or violet light","Feel connection to something larger","Practice gratitude for consciousness itself","Observe without judgment for 2 minutes","Visualize light entering crown","Rest in pure awareness","Say: I am connected to all that is"],practice2:["Meditate on infinite space","Gently touch top of head","Imagine boundaries dissolving","Breathe as if the universe breathes you","Notice awareness of being aware","Feel unity with all beings","Rest in stillness and openness","Visualize violet light at crown","Simply be, without doing","Say: I am one with everything"],inquiry:"What is awareness itself noticing right now?"},Sunday:{key:"solar",name:"Solar Plexus Chakra - Manipura",planet:"☉ Sun",color:"Bright yellow",theme:"Confidence, direction, expansion",element:"Fire",sense:"Sight",symbol:"Lotus with 10 petals",endocrineGland:"Pancreas",bodyAreas:"Stomach, liver, gallbladder, nervous system",location:"Two fingers above the navel.",visualization:"Gentle rays of the sun, a rich yellow wheat field",keywords:["Thoughts","intellect","ego","personal power","will","self-control","self-expression"],roleAndPurpose:'The third chakra is the mental power center, responsible for our opinions, beliefs, self-esteem and self-confidence. It acts as an "energy pump" for the physical body and subtle bodies.',commonIssues:["Power struggles","Anger","Resentment","Digestive and metabolic problems","Weight issues"],fundamentalTruths:["I feel and think!","Honor yourself!"],guidedReflections:["Do I trust myself to make the right decisions, or do I constantly seek external approval?","Where in my life do I give away my power, and why do I allow it?","What would my life look like if I fully trusted my inner fire?"],image:"/Community/Chakras/Manipura1.webp",image2:"/Community/Chakras/Manipura2.webp",practice:["Stand tall and open your chest for 30 seconds","Take 5 strong belly breaths","Place hand above navel and feel warmth","Do one small task you have been avoiding","Sit upright and feel your core engaged","Say your name out loud with confidence","Visualize a warm yellow light in your belly","Clench fists, release slowly, repeat 3 times","Make one clear decision today","Say: I trust myself"],practice2:["Stand in a power pose for 1 minute","Laugh out loud for 15 seconds","List 3 things you're good at","Breathe fire breath (quick exhales)","Straighten your posture fully","Make strong eye contact with yourself in mirror","Do 5 confident shoulder rolls","Visualize golden light expanding from core","Complete one unfinished task","Say: I am powerful and capable"],inquiry:"Where am I ready to step up or expand?"}}}_buildChakraOptions(){const e={root:"Tuesday",sacral:"Monday",solar:"Sunday",heart:"Friday",throat:"Wednesday","third-eye":"Thursday",crown:"Saturday"};this.CHAKRA_OPTIONS=[{value:"root",label:"Root Chakra",image:"/Community/Chakras/Muladhara1.jpg",image2:"/Community/Chakras/Muladhara2.webp"},{value:"sacral",label:"Sacral Chakra",image:"/Community/Chakras/Svadhistana1.jpg",image2:"/Community/Chakras/Svadhistana2.webp"},{value:"solar",label:"Solar Plexus",image:"/Community/Chakras/Manipura1.jpg",image2:"/Community/Chakras/Manipura2.webp"},{value:"heart",label:"Heart Chakra",image:"/Community/Chakras/Anahata1.jpg",image2:"/Community/Chakras/Anahata2.webp"},{value:"throat",label:"Throat Chakra",image:"/Community/Chakras/Vissudha1.jpg",image2:"/Community/Chakras/Vissudha2.webp"},{value:"third-eye",label:"Third Eye",image:"/Community/Chakras/Ajna1.jpg",image2:"/Community/Chakras/Ajna2.webp"},{value:"crown",label:"Crown Chakra",image:"/Community/Chakras/Sahasrara1.jpg",image2:"/Community/Chakras/Sahasrara2.webp"}],this.CHAKRA_OPTIONS.forEach(i=>{const o=e[i.value];if(o&&this.CHAKRA_SCHEDULE[o]){const n=this.CHAKRA_SCHEDULE[o];i.practices=n.practice,i.practices2=n.practice2,i.inquiry=n.inquiry,["name","planet","color","theme","element","sense","symbol","endocrineGland","bodyAreas","location","visualization","keywords","roleAndPurpose","commonIssues","fundamentalTruths","guidedReflections"].forEach(r=>{n[r]!==void 0&&(i[r]=i[r]??n[r])})}})}getParticipantText(){return`${this.state.participants} healing together`}buildCardFooter(){var o;if(!this._chakraDataReady||!this.state.currentDay)return`<div style="text-align:left;"><span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span></div>`;const e=this.CHAKRA_SCHEDULE[this.state.currentDay],i=((o=e==null?void 0:e.name)==null?void 0:o.split(" - ")[0])??(e==null?void 0:e.name)??"";return`
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
            <span style="font-size:11px;color:var(--text-muted);">Daily Chakra: <strong style="color:var(--text);font-weight:600;">${i}</strong></span>
        </div>`}onPersonalTabEnter(){this._masteryLoaded||this._loadChakraMastery()}_stepDailyImage(e){var n;this.state.dailyImageIndex=(this.state.dailyImageIndex+e+2)%2;const i=(n=this.CHAKRA_SCHEDULE)==null?void 0:n[this.state.currentDay],o=document.getElementById(`${this.roomId}DailyCarouselImg`);o&&i&&(o.src=this.state.dailyImageIndex===0?i.image:i.image2)}nextDailyImage(){this._stepDailyImage(1)}previousDailyImage(){this._stepDailyImage(-1)}_stepPersonalImage(e){var n;this.state.personalImageIndex=(this.state.personalImageIndex+e+2)%2;const i=(n=this.CHAKRA_OPTIONS)==null?void 0:n.find(r=>r.value===this.state.personalFocus),o=document.getElementById(`${this.roomId}PersonalCarouselImg`);o&&i&&(o.src=this.state.personalImageIndex===0?i.image:i.image2)}nextPersonalImage(){this._stepPersonalImage(1)}previousPersonalImage(){this._stepPersonalImage(-1)}startPersonalSession(){var n;if(!this._chakraDataReady){window.Core.showToast("Loading chakra data, please wait…");return}const e=(n=document.getElementById(`${this.roomId}PersonalFocus`))==null?void 0:n.value;if(!e){window.Core.showToast("Please select a focus");return}this.state.personalFocus=e,this.state.personalImageIndex=0;const i=this.CHAKRA_OPTIONS.find(r=>r.value===e),o=document.getElementById(`${this.roomId}PersonalSession`);o&&(o.style.display="block",o.innerHTML=this._getChakraDisplayHTML(i,0,!1,!1),window.Core.showToast(`${i.label} session started`))}_getChakraDisplayHTML(e,i,o=!1,n=!1){const r=`${e.key}-${o?"daily":"personal"}-${n}`;return this._chakraDisplayCache[r]||(this._chakraDisplayCache[r]=this.buildChakraDisplay(e,i,o,n)),this._chakraDisplayCache[r]}buildChakraDisplay(e,i,o=!1,n=!1){var g;const r=i===0?e.image:e.image2,a=(e.keywords||[]).map(f=>`<span style="display:inline-block;padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--text-muted);margin:3px 4px;white-space:nowrap;">${f}</span>`).join(""),l=[{label:"Planet",value:e.planet},{label:"Element",value:e.element},{label:"Color",value:e.color},{label:"Symbol",value:e.symbol},{label:"Sense",value:e.sense},{label:"Location",value:e.location},{label:"Body Areas",value:e.bodyAreas},{label:"Gland",value:e.endocrineGland}].filter(f=>f.value).map(f=>`
            <div style="text-align:center;min-width:80px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px;font-weight:700;">${f.label}</div>
                <div style="font-size:13px;font-weight:500;">${f.value}</div>
            </div>`).join(""),d=(e.commonIssues||[]).map(f=>`<li style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;">${f}</li>`).join(""),c=(e.guidedReflections||[]).map(f=>`<li style="margin:8px 0;font-size:14px;line-height:1.6;color:var(--text);">${f}</li>`).join(""),p=this.roomId,h=o?"daily":"personal",m=o?"Daily":"Personal";return`
        <!-- ── Image carousel ── -->
        <div style="text-align:center;margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <button type="button" data-action="prevChakraImage" data-scope="${h}" style="background:var(--surface);border:2px solid var(--border);border-radius:50%;width:40px;height:40px;min-width:40px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">‹</button>
            <img width="500" height="400" id="${p}${m}CarouselImg"
                 src="${r}" alt="${e.name}" loading="lazy" decoding="async"
                 style="max-width:min(500px,calc(100% - 100px));width:100%;height:auto;border-radius:var(--radius-md);box-shadow:0 4px 12px rgba(0,0,0,0.1);display:block;flex:1 1 auto;min-width:0;">
            <button type="button" data-action="nextChakraImage" data-scope="${h}" style="background:var(--surface);border:2px solid var(--border);border-radius:50%;width:40px;height:40px;min-width:40px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">›</button>
        </div>
        <h4 style="font-family:var(--serif);font-size:20px;margin:0 0 20px;text-align:center;">${e.name}</h4>

        <!-- ── Enriched card ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            ${e.roleAndPurpose?`
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:10px;">Represents</div>
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--text-muted);max-width:560px;margin:0 auto;">${e.roleAndPurpose}</p>
            </div>`:""}
            ${e.theme?`
            <div style="text-align:center;margin-bottom:20px;padding-top:16px;border-top:1px solid var(--border);">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">Theme</div>
                <p style="font-size:14px;font-weight:600;color:var(--text);margin:0;">${e.theme}</p>
            </div>`:""}
            ${a?`
            <div style="margin-bottom:20px;padding-top:20px;border-top:1px solid var(--border);">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;text-align:center;margin-bottom:8px;">Keywords</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;">${a}</div>
            </div>`:""}
            ${l?`
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
                ${l}
            </div>`:""}
        </div>

        <!-- ── Fundamental Truths & Visualization ── -->
        ${(g=e.fundamentalTruths)!=null&&g.length||e.visualization?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:16px;text-align:center;">Fundamental Truths</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${(e.fundamentalTruths||[]).map(f=>`
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.7;margin:0;text-align:center;color:var(--text);">"${f}"</p>`).join("")}
                ${e.visualization?`
                <div style="margin-top:8px;padding-top:12px;border-top:1px solid var(--border);">
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:6px;text-align:center;">Visualization</div>
                    <p style="font-size:14px;color:var(--text-muted);text-align:center;margin:0;font-style:italic;">${e.visualization}</p>
                </div>`:""}
            </div>
        </div>`:""}

        <!-- ── Common Issues + Guided Reflections ── -->
        ${d||c?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;display:flex;flex-direction:column;gap:8px;">
            ${d?`
            <details>
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span>▶</span> Common Issues
                </summary>
                <ul style="margin:12px 0 0 0;padding:0 0 0 4px;list-style:none;">
                    ${d}
                </ul>
            </details>`:""}
            ${c?`
            <details ${d?'style="border-top:1px solid var(--border);padding-top:8px;"':""}>
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span>▶</span> Guided Reflections for Clarity &amp; Growth
                </summary>
                <p style="font-size:13px;color:var(--text-muted);margin:10px 0 12px 0;line-height:1.6;font-style:italic;">Take a few moments to reflect on each question. Let your answers flow naturally, without overthinking or judgment. There are no wrong answers here.</p>
                <ul style="margin:0;padding:0;list-style:none;">
                    ${c}
                </ul>
            </details>`:""}
        </div>`:""}

        <!-- ── Today's Inquiry ── -->
        ${e.inquiry?`
        <div style="background:var(--surface);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px;">${o?"Today's":"Guiding"} Inquiry</div>
            <p style="font-family:var(--serif);font-size:17px;line-height:1.7;margin:0 auto;max-width:520px;">"${e.inquiry}"</p>
        </div>`:""}

        <!-- ── Chakra Journal ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;">📓 Chakra Journal</div>
                <button type="button" data-action="toggleChakraJournal" data-prefix="${m}"
                    id="${p}${m}JournalLogBtn"
                    style="font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;font-weight:600;">View Log</button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 14px 0;line-height:1.6;">
                Sit with this chakra's energy for a moment. What do you notice in your body? What emotions or thoughts arise? How does this energy center feel in your life right now?
            </p>
            <div id="${p}${m}JournalForm">
                <textarea id="${p}${m}JournalInput"
                    placeholder="e.g. I notice tension in my chest… this chakra feels blocked lately… I'm drawn to the color ${e.color}…"
                    style="width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;line-height:1.6;resize:vertical;min-height:110px;font-family:inherit;"
                ></textarea>
                <button type="button" data-action="saveChakraJournal"
                    data-prefix="${m}" data-key="${e.key}"
                    style="margin-top:10px;padding:9px 22px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;">
                    Save to Journal
                </button>
            </div>
            <div id="${p}${m}JournalLog" style="display:none;">
                <div id="${p}${m}JournalLogList" style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;"></div>
            </div>
        </div>

        ${n?`
        <!-- ── Community Energy ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">🌀 Community Energy</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px 0;">Share a one-line reflection on today's chakra energy.</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
                <input id="${p}EnergyInput" type="text" maxlength="140"
                    aria-label="Your energy intention"
                    placeholder="One line — what does this chakra energy mean to you today?"
                    style="flex:1;min-width:0;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;font-family:inherit;"
                    onkeydown="if(event.key==='Enter')document.getElementById('${p}EnergyShareBtn')?.click()"
                />
                <button type="button" id="${p}EnergyShareBtn"
                        data-action="submitCommunityEnergy"
                    style="padding:9px 18px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                    Share
                </button>
            </div>
            <div id="${p}EnergyList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;">
                <div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>
            </div>
        </div>`:""}`}buildBody(){return`
        <div class="ps-body" style="display:flex;">
            <main class="tarot-main" style="flex:1;padding:24px;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;">
                <div style="width:100%;">
                    ${this.buildTabNav(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg> Today's Collective Energy`,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Solo Chakra Work')}
                    <div id="${this.roomId}DailyTab"    style="display:block;">${this._buildDailyTab()}</div>
                    <div id="${this.roomId}PersonalTab" style="display:none;">${this._buildPersonalTab()}</div>
                </div>
            </main>
        </div>`}_buildDailyTab(){if(!this._chakraDataReady||!this.state.currentDay)return`<div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;text-align:center;"><div style="color:var(--text-muted);font-size:14px;padding:40px;">Loading today's focus…</div></div>`;const e=this.CHAKRA_SCHEDULE[this.state.currentDay];return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px 16px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg> Today's Collective Energy</h3>
            ${this._getChakraDisplayHTML(e,this.state.dailyImageIndex,!0,!0)}
        </div>
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
            <div>
                <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 8px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Community Discussion</h4>
                <div style="display:flex;flex-direction:column;height:100%;">
                    ${this.buildChatContainer("daily","Share your thoughts on today's chakra...")}
                </div>
            </div>
            ${this.buildParticipantSidebarHTML("Online Lightworkers",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
        </div>`}_buildPersonalTab(){return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Solo Chakra Work</h3>
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:8px;font-weight:600;">Choose Your Focus:</label>
                <select id="${this.roomId}PersonalFocus"
                        style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--background);font-size:14px;">
                    <option value="">Select a chakra...</option>
                    ${(this.CHAKRA_OPTIONS||[]).map(e=>`<option value="${e.value}">${e.label}</option>`).join("")}
                </select>
            </div>
            <button type="button" data-action="startPersonalSession"
                    style="width:100%;padding:14px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:16px;">
                Begin Session
            </button>
            <div id="${this.roomId}PersonalSession" style="margin-top:24px;display:none;"></div>
        </div>

        <!-- Mastery Tracker -->
        <div style="border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px;background:var(--surface);margin-top:16px;">
            <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Chakra Mastery
            </h4>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
                <span>Chakras Explored</span>
                <span id="${this.roomId}MasteryCount">Loading…</span>
            </div>
            <div style="height:8px;border-radius:4px;background:var(--border);overflow:hidden;margin-bottom:16px;">
                <div id="${this.roomId}MasteryProgress" style="height:100%;border-radius:4px;background:linear-gradient(90deg,var(--neuro-accent),var(--neuro-accent-light));width:0%;transition:width 0.5s ease;"></div>
            </div>
            <div id="${this.roomId}MasteryChakras" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
                <span style="color:var(--text-muted);font-size:13px;">Loading…</span>
            </div>
        </div>`}_toggleChakraJournalLog(e){const i=this.roomId,o=document.getElementById(`${i}${e}JournalLog`),n=document.getElementById(`${i}${e}JournalForm`),r=document.getElementById(`${i}${e}JournalLogBtn`);if(!o)return;const a=o.style.display!=="none";o.style.display=a?"none":"",n.style.display=a?"":"none",r.textContent=a?"View Log":"Write Entry",a||this._loadChakraJournalLog(e)}async _saveChakraJournalEntry(e,i,o){var d;const n=this.roomId,r=document.getElementById(`${n}${e}JournalInput`),a=(d=r==null?void 0:r.value)==null?void 0:d.trim();if(!a){window.Core.showToast("Please write something first");return}const s=window.Core.state.currentUser,l=new Date().toISOString().slice(0,10);try{await u._sb.from("reiki_sessions").insert({user_id:s==null?void 0:s.id,chakra_key:i,chakra_name:o,date:l,entry:a}),r.value="",window.Core.showToast("Saved to your chakra journal ✨"),this._masteryLoaded=!1,e==="Personal"&&this._loadChakraMastery()}catch(c){console.warn("[ReikiRoom] journal save failed",c),window.Core.showToast("Could not save — please try again")}}async _loadChakraJournalLog(e){const i=this.roomId,o=window.Core.state.currentUser,n=document.getElementById(`${i}${e}JournalLogList`);if(!(!n||!(o!=null&&o.id))){n.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>';try{const{data:r,error:a}=await u._sb.from("reiki_sessions").select("id, chakra_name, date, entry").eq("user_id",o.id).order("created_at",{ascending:!1}).limit(30);if(a)throw a;if(!r||r.length===0){n.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">No journal entries yet.</div>';return}n.innerHTML=r.map(s=>`
                <div id="rj-${s.id}" style="background:var(--background);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:600;color:var(--accent);">${this._escapeHtml(s.chakra_name||"")} · ${s.date}</span>
                        <div style="display:flex;gap:10px;">
                            <button onclick="window.ReikiRoom._editSessionEntry('${s.id}')" style="font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">Edit</button>
                            <button onclick="window.ReikiRoom._deleteSessionEntry('${s.id}')" style="font-size:12px;color:#e57373;background:none;border:none;cursor:pointer;padding:0;">Delete</button>
                        </div>
                    </div>
                    <div id="rj-text-${s.id}" style="font-size:14px;line-height:1.6;color:var(--text);">${this._escapeHtml(s.entry)}</div>
                    <div id="rj-edit-${s.id}" style="display:none;">
                        <textarea style="width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;line-height:1.5;resize:vertical;min-height:80px;font-family:inherit;margin-top:8px;">${this._escapeHtml(s.entry)}</textarea>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button onclick="window.ReikiRoom._saveEditedEntry('${s.id}')" style="padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;">Save</button>
                            <button onclick="window.ReikiRoom._cancelEditEntry('${s.id}')" style="padding:5px 14px;background:none;border:1px solid var(--border);border-radius:var(--radius-md);font-size:13px;cursor:pointer;color:var(--text-muted);">Cancel</button>
                        </div>
                    </div>
                </div>`).join("")}catch(r){console.warn("[ReikiRoom] load journal failed",r),n.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load journal.</div>'}}}_editSessionEntry(e){var i,o;(i=document.getElementById(`rj-text-${e}`))!=null&&i.style&&(document.getElementById(`rj-text-${e}`).style.display="none"),(o=document.getElementById(`rj-edit-${e}`))!=null&&o.style&&(document.getElementById(`rj-edit-${e}`).style.display="")}_cancelEditEntry(e){var i,o;(i=document.getElementById(`rj-text-${e}`))!=null&&i.style&&(document.getElementById(`rj-text-${e}`).style.display=""),(o=document.getElementById(`rj-edit-${e}`))!=null&&o.style&&(document.getElementById(`rj-edit-${e}`).style.display="none")}async _saveEditedEntry(e){var r;const i=document.getElementById(`rj-edit-${e}`),o=i==null?void 0:i.querySelector("textarea"),n=(r=o==null?void 0:o.value)==null?void 0:r.trim();if(n)try{await u._sb.from("reiki_sessions").update({entry:n}).eq("id",e);const a=document.getElementById(`rj-text-${e}`);a&&(a.textContent=n),this._cancelEditEntry(e),window.Core.showToast("Entry updated")}catch(a){console.warn("[ReikiRoom] edit failed",a),window.Core.showToast("Could not update entry")}}async _deleteSessionEntry(e){var i;try{await u._sb.from("reiki_sessions").delete().eq("id",e),(i=document.getElementById(`rj-${e}`))==null||i.remove(),window.Core.showToast("Entry deleted")}catch(o){console.warn("[ReikiRoom] delete failed",o),window.Core.showToast("Could not delete entry")}}async _submitCommunityEnergy(){var a;const e=document.getElementById(`${this.roomId}EnergyInput`),i=(a=e==null?void 0:e.value)==null?void 0:a.trim();if(!i)return;const o=window.Core.state.currentUser,n=this.CHAKRA_SCHEDULE[this.state.currentDay],r=new Date().toISOString().slice(0,10);try{await u._sb.from("reiki_shares").insert({user_id:o==null?void 0:o.id,display_name:(o==null?void 0:o.display_name)||(o==null?void 0:o.username)||(o==null?void 0:o.name)||"A seeker",chakra_key:n==null?void 0:n.key,date:r,share:i}),e.value="",await this._loadCommunityEnergy(),window.Core.showToast("Shared 🌀")}catch(s){console.warn("[ReikiRoom] community energy save failed",s),window.Core.showToast("Could not share — please try again")}}async _loadCommunityEnergy(){const e=this.CHAKRA_SCHEDULE[this.state.currentDay],i=new Date().toISOString().slice(0,10),o=document.getElementById(`${this.roomId}EnergyList`);if(!(!o||!e)){this._energyPurgedToday||(this._energyPurgedToday=!0,u._sb.from("reiki_shares").delete().lt("date",i).then(()=>{}));try{const{data:n,error:r}=await u._sb.from("reiki_shares").select("display_name, share, created_at").eq("chakra_key",e.key).eq("date",i).order("created_at",{ascending:!1}).limit(50);if(r)throw r;if(!n||n.length===0){o.innerHTML=`<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Be the first to share today's energy.</div>`;return}o.innerHTML=n.map(a=>`
                <div style="display:flex;gap:10px;align-items:baseline;padding:8px 10px;background:var(--background);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <span style="font-size:12px;font-weight:600;color:var(--accent);white-space:nowrap;flex-shrink:0;">${this._escapeHtml(a.display_name)}</span>
                    <span style="font-size:14px;line-height:1.5;color:var(--text);">${this._escapeHtml(a.share)}</span>
                </div>`).join("")}catch(n){console.warn("[ReikiRoom] load community energy failed",n),o.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load.</div>'}}}async _loadChakraMastery(){const e=window.Core.state.currentUser,i=document.getElementById(`${this.roomId}MasteryCount`),o=document.getElementById(`${this.roomId}MasteryProgress`),n=document.getElementById(`${this.roomId}MasteryChakras`);if(!n)return;const r=[{key:"root",label:"Root",color:"#ef4444"},{key:"sacral",label:"Sacral",color:"#f97316"},{key:"solar",label:"Solar Plexus",color:"#eab308"},{key:"heart",label:"Heart",color:"#22c55e"},{key:"throat",label:"Throat",color:"#3b82f6"},{key:"third-eye",label:"Third Eye",color:"#6366f1"},{key:"crown",label:"Crown",color:"#a855f7"}];if(!(e!=null&&e.id)){n.innerHTML=r.map(a=>`<span style="padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;background:var(--border);color:var(--text-muted);">${a.label}</span>`).join(""),i&&(i.textContent="0 / 7");return}try{const{data:a,error:s}=await u._sb.from("reiki_sessions").select("chakra_key").eq("user_id",e.id);if(s)throw s;const l=new Set((a||[]).map(p=>p.chakra_key)),d=r.filter(p=>l.has(p.key)).length,c=Math.round(d/7*100);i&&(i.textContent=`${d} / 7`),o&&(o.style.width=`${c}%`),n.innerHTML=r.map(p=>{const h=l.has(p.key);return`<span style="padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;
                    background:${h?p.color:"var(--border)"};
                    color:${h?"#fff":"var(--text-muted)"};
                    opacity:${h?"1":"0.5"};
                    transition:all 0.3s ease;">${p.label}</span>`}).join(""),this._masteryLoaded=!0}catch(a){console.warn("[ReikiRoom] load mastery failed",a),i&&(i.textContent="— / 7")}}onEnter(){this.initializeChat(),requestAnimationFrame(()=>{var e;(e=document.querySelector(`#${this.roomId}View .tarot-main`))==null||e.scrollTo(0,0),this._loadCommunityEnergy()})}getActions(){return{...super.getActions(),startPersonalSession:()=>this.startPersonalSession(),prevChakraImage:e=>{this._actionEl(e).dataset.scope==="daily"?this.previousDailyImage():this.previousPersonalImage()},nextChakraImage:e=>{this._actionEl(e).dataset.scope==="daily"?this.nextDailyImage():this.nextPersonalImage()},toggleChakraJournal:e=>this._toggleChakraJournalLog(this._actionEl(e).dataset.prefix),saveChakraJournal:e=>{const i=this._actionEl(e);this._saveChakraJournalEntry(i.dataset.prefix,i.dataset.key)},submitCommunityEnergy:()=>this._submitCommunityEnergy()}}getInstructions(){return`
            <p><strong>A space for energy healing and chakra alignment.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li><strong>Today's Collective Energy:</strong> Each day follows a planetary chakra cycle. The entire community focuses on one chakra energy.</li>
                <li><strong>Solo Chakra Work:</strong> Choose any chakra for your individual needs.</li>
                <li><strong>Community Discussion:</strong> Share your experiences and healing journey.</li>
            </ul>
            <h3>7-Day Planetary Chakra Cycle:</h3>
            <ul>
                <li><strong>Sunday (Sun):</strong> Solar Plexus - Confidence &amp; expansion</li>
                <li><strong>Monday (Moon):</strong> Sacral Chakra - Emotional flow &amp; creativity</li>
                <li><strong>Tuesday (Mars):</strong> Root Chakra - Grounding &amp; strength</li>
                <li><strong>Wednesday (Mercury):</strong> Throat Chakra - Truth &amp; expression</li>
                <li><strong>Thursday (Jupiter):</strong> Third Eye - Intuition &amp; vision</li>
                <li><strong>Friday (Venus):</strong> Heart Chakra - Love &amp; connection</li>
                <li><strong>Saturday (Saturn):</strong> Crown Chakra - Awareness &amp; unity</li>
            </ul>
            <h3>Energy Work Guidelines:</h3>
            <ul>
                <li>Find a quiet, comfortable space</li>
                <li>Practice non-forcing - allow energy to flow naturally</li>
                <li>Be patient with yourself</li>
                <li>This is complementary to medical care, not a replacement</li>
            </ul>`}}Object.assign(Oe.prototype,Me);Object.assign(Oe.prototype,ct);const Qt=new Oe;window.ReikiRoom=Qt;var nt;(nt=window.dispatchRoomReady)==null||nt.call(window,"reiki");const ei={state:{isEnabled:!1,isRendered:!1},config:{FEATURE_ENABLED:!1},getHTML(){return this.config.FEATURE_ENABLED?`
            <section class="section" id="resonanceContent" aria-labelledby="resonanceSectionTitle">
                <div class="section-header">
                    <div class="section-title" id="resonanceSectionTitle">Resonance</div>
                    <div style="font-size:12px;color:var(--text-muted);">Community energy field</div>
                </div>
                <div class="resonance-container"></div>
            </section>`:'<div id="resonanceContent" style="display:none;"></div>'},render(){const t=document.getElementById("resonanceContainer");if(!t){console.warn("resonanceContainer not found - skipping resonance render");return}t.innerHTML=this.getHTML(),this.state.isRendered=!0},enable(){var t;if(this.state.isEnabled){console.warn("Resonance already enabled");return}this.config.FEATURE_ENABLED=!0,this.state.isEnabled=!0,this.state.isRendered?this.render():(t=document.getElementById("resonanceContent"))==null||t.style.setProperty("display","block")},disable(){var t;if(!this.state.isEnabled){console.warn("Resonance already disabled");return}this.config.FEATURE_ENABLED=!1,this.state.isEnabled=!1,(t=document.getElementById("resonanceContent"))==null||t.style.setProperty("display","none")},toggle(){this.state.isEnabled?this.disable():this.enable()},getIsEnabled(){return this.config.FEATURE_ENABLED&&this.state.isEnabled},getStatus(){return{featureEnabled:this.config.FEATURE_ENABLED,isEnabled:this.state.isEnabled,isRendered:this.state.isRendered}}};window.Resonance=ei;const pt={classes:[{title:"Tarot Masterclass",subtitle:"Learn to read the cards with confidence",info:"Discover the ancient wisdom of tarot through interactive lessons. Suitable for beginners and intermediate practitioners. Small group setting ensures personalized guidance.",type:"🎴 Online Zoom Class",datetime:"Monday, 10:00 AM (GMT+2)",image:"/CTA/Sessions/Sessions4.jpg",whatsapp:"https://wa.me/+972524588767"},{title:"Classic Meditation Masterclass",subtitle:"Foundational techniques for daily practice",info:"Master the essential meditation techniques used for thousands of years. Learn breath control, mindfulness, and deep relaxation methods you can use every day.",type:"🧘 Online Zoom Class",datetime:"Thursday, 12:00 PM (GMT+2)",image:"/CTA/Sessions/Sessions3.jpg",whatsapp:"https://wa.me/+972524588767"}],sessions:[{title:"Private Tarot Spread",subtitle:"Personal reading tailored to your questions",info:"A one-on-one deep dive into your personal journey. Bring your questions about love, career, or life path. Receive guidance and clarity through the cards.",type:"🎴 In-Person or Online",datetime:"Daily • Flexible Hours",image:"/CTA/Sessions/Sessions1.jpg",whatsapp:"https://wa.me/+972524588767"},{title:"Private Reiki Healing Session",subtitle:"Energy healing for balance and wellness",info:"Experience deep relaxation and energetic clearing. Reiki helps release blockages, reduce stress, and restore your natural state of wellbeing. Sessions tailored to your needs.",type:"✨ In-Person or Online",datetime:"Daily • Flexible Hours",image:"/CTA/Sessions/Sessions2.jpg",whatsapp:"https://wa.me/+972524588767"}],state:{classIndex:0,sessionIndex:0,classInterval:null,sessionInterval:null,isInitialized:!1},config:{ROTATION_INTERVAL:15e3,FADE_DURATION:500,CARDS:{classes:{imageId:"classesImage",contentId:"classesContent",cardSelector:".classes-card",ctaText:"Register via WhatsApp",stateKey:"classIndex",intervalKey:"classInterval",slots:["classes0","classes1"]},sessions:{imageId:"sessionsImage",contentId:"sessionsContent",cardSelector:".sessions-card",ctaText:"Book via WhatsApp",stateKey:"sessionIndex",intervalKey:"sessionInterval",slots:["sessions0","sessions1"]}},ADMIN_TABS:[{id:"classes0",label:"◀ Left Flyer 1"},{id:"classes1",label:"◀ Left Flyer 2"},{id:"sessions0",label:"Right Flyer 1 ▶"},{id:"sessions1",label:"Right Flyer 2 ▶"}],FLYER_FILES:{Sessions:["Sessions1.jpg","Sessions2.jpg","Sessions3.jpg","Sessions4.jpg","Sessions5.jpg","Sessions6.jpg","Sessions7.jpg","Sessions8.jpg","Sessions9.jpg"],Workshops:["Workshops1.jpg","Workshops2.jpg","Workshops3.jpg","Workshops4.jpg","Workshops5.jpg","Workshops6.jpg"]}},flyerCatalog:{"Sessions1.jpg":{title:"1 on 1 Private Tarot Reading",subtitle:"A deeply personal reading just for you",info:"Sit down one-on-one for an intimate tarot session tailored entirely to your questions and journey. Whether you seek clarity on love, career, purpose, or personal growth - the cards will meet you exactly where you are.",type:"🎴 In-Person or Online"},"Sessions2.jpg":{title:"1 on 1 Reiki Healing Session",subtitle:"Deep energetic healing, tailored to you",info:"A private Reiki session focused entirely on your energetic field. Release blockages, restore balance, and return to a natural state of ease and wholeness. Each session is intuitive and adapted to what your body and energy most need.",type:"✨ In-Person or Online"},"Sessions3.jpg":{title:"Classic Meditation Class",subtitle:"Timeless techniques for a calm, clear mind",info:"Learn the foundational meditation practices that have been used for thousands of years. Covering breath awareness, body scanning, and silent sitting - this class gives you practical tools you can return to every day.",type:"🧘 Online Zoom Class"},"Sessions4.jpg":{title:"Tarot Masterclass",subtitle:"Read the cards with depth and confidence",info:"An immersive class exploring the full language of tarot - from Major Arcana archetypes to Minor Arcana nuance. Develop your intuition, learn how to construct meaningful spreads, and find your own voice as a reader.",type:"🎴 Online Zoom Class"},"Sessions5.jpg":{title:"OSHO Active Meditations",subtitle:"Move, release, and arrive in stillness",info:"OSHO Active Meditations use dynamic movement, breath, and sound to shake loose tension and mental noise - before arriving at deep inner silence. Suitable for all levels, no experience required.",type:"🌀 In-Person or Online"},"Sessions6.jpg":{title:"Guided Visualization Session",subtitle:"Journey inward through the power of the mind",info:"A deeply relaxing guided session using vivid inner imagery to access clarity, healing, and inspiration. Ideal for stress relief, goal alignment, and connecting with your deeper wisdom.",type:"🌟 In-Person or Online"},"Sessions7.jpg":{title:"E.F.T. Healing Session",subtitle:"Tap into freedom from stress and old patterns",info:"Emotional Freedom Technique (EFT) combines gentle tapping on acupressure points with focused intention to release emotional blocks, reduce anxiety, and shift limiting beliefs held in the body.",type:"🤲 In-Person or Online"},"Sessions8.jpg":{title:"Sivananda Yoga Class",subtitle:"Classical yoga for body, breath, and spirit",info:"A traditional Sivananda yoga class integrating asana, pranayama, relaxation, and mantra. Rooted in the classical five-point system, this class nourishes the whole being - body, mind, and soul.",type:"🕉️ In-Person"},"Sessions9.jpg":{title:"Divine Intimacy Lecture",subtitle:"Explore the sacred relationship with the self",info:"A reflective lecture-style session exploring the deeper dimensions of intimacy - with yourself, with life, and with the divine. Drawing from mystical traditions, this talk invites you into a more tender and conscious way of being.",type:"💫 In-Person or Online"},"Workshops1.jpg":{title:"Tarot Workshop",subtitle:"Your complete introduction to the cards",info:"A full immersive workshop covering the 78-card system, major and minor arcana, spreads, and intuitive reading practice. You will leave with the confidence and foundation to read for yourself and others.",type:"🎴 Workshop"},"Workshops2.jpg":{title:"Reiki Course",subtitle:"Learn to channel healing energy",info:"A comprehensive Reiki training covering the history, principles, hand positions, and attunement process. Whether you are a complete beginner or looking to deepen your practice, this course opens the door to self-healing and healing others.",type:"✨ Workshop"},"Workshops3.jpg":{title:"Meditation Workshop",subtitle:"Build a practice that transforms your life",info:"An experiential workshop exploring multiple meditation styles - from breath-focused techniques to body awareness and mantra-based practice. You will leave with a personalised toolkit and the understanding to maintain a consistent daily practice.",type:"🧘 Workshop"},"Workshops4.jpg":{title:"Rainbow Light-body Workshop",subtitle:"Activate and align your energetic body",info:"A profound workshop working with the subtle energy body, chakra system, and light-body activation. Through guided practices, visualization, and energy work, participants explore the luminous nature of their own being.",type:"🌈 Workshop"},"Workshops5.jpg":{title:"OSHO Camp (3 Days)",subtitle:"Three days of immersive meditation and awakening",info:"A transformative 3-day residential camp using OSHO Active and silent meditations to strip away conditioning and awaken presence. Each day deepens your practice through movement, music, silence, and community.",type:"🌀 3-Day Retreat"},"Workshops6.jpg":{title:"OSHO Camp (4 Days)",subtitle:"Four days of deep immersion and inner freedom",info:"An extended 4-day OSHO residential camp offering a deeper dive into the full spectrum of OSHO meditations. More time means more depth - more silence, more breakthroughs, and more space to simply be.",type:"🌀 4-Day Retreat"}},_flyerBase:"/CTA/",_adminModal:null,_adminActiveTab:"classes0",_adminDraft:{classes0:null,classes1:null,sessions0:null,sessions1:null},_staggerTimeout:null,_lightboxEsc:null,getHTML(){return`
        <section class="section" aria-labelledby="upcomingEventsTitle">
            <div class="section-header">
                <div class="section-title" id="upcomingEventsTitle">Upcoming Events</div>

            </div>
            <div class="events-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                ${this._getCardHTML("classes")}
                ${this._getCardHTML("sessions")}
            </div>
        </section>`},_getCardHTML(t){const e=this.config.CARDS[t],i=this[t][0];return`
        <div class="event-card ${t}-card" style="position:relative;overflow:hidden;">
            ${this._getFlyerHTML(i,e.imageId,this[t].length)}
            ${this._getContentHTML(i,e.contentId,e.ctaText)}
        </div>`},_getFlyerHTML(t,e,i){const o=Array.from({length:i},(n,r)=>`<span class="dot${r===0?" active":""}" data-index="${r}"
                   style="width:8px;height:8px;border-radius:50%;background:white;opacity:${r===0?"1":"0.5"};"></span>`).join("");return`
        <div class="event-flyer" style="position:relative;background:var(--neuro-bg);">
            <img src="${this.escapeHtml(t.image)}" alt="${this.escapeHtml(t.title)}" id="${e}"
                 width="600" height="400"
                 onclick="UpcomingEvents.openLightbox(this.src)"
                 loading="lazy" decoding="async"
                 style="width:100%;height:auto;display:block;transition:opacity ${this.config.FADE_DURATION}ms ease;cursor:zoom-in;">
            <div class="flyer-indicator" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;">
                ${o}
            </div>
        </div>`},_getContentHTML(t,e,i){return`
        <div class="event-content" id="${e}" style="padding:20px;">
            <div class="event-type" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${this.escapeHtml(t.type)}</div>
            <h3 class="event-heading" style="font-family:var(--serif);font-size:20px;margin-bottom:4px;">${this.escapeHtml(t.title)}</h3>
            <div class="event-subheading" style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">${this.escapeHtml(t.subtitle)}</div>
            <div class="event-info" style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:16px;padding:12px;background:var(--neuro-bg);border-radius:var(--radius-sm);border-left:3px solid var(--accent);">
                ${this.escapeHtml(t.info)}
            </div>
            <div class="event-datetime" style="font-size:13px;color:var(--text-muted);margin-bottom:16px;display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${this.escapeHtml(t.datetime)}</div>
            <button type="button" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;width:100%;" onclick="UpcomingEvents.openWhatsApp('${this.escapeHtml(t.whatsapp)}')"
                    aria-label="${this.escapeHtml(i)} for ${this.escapeHtml(t.title)}">
                ${this.escapeHtml(i)}
            </button>
        </div>`},openLightbox(t){if(document.getElementById("flyerLightbox"))return;const e=document.createElement("div");e.id="flyerLightbox",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label","Flyer image"),e.style.cssText=`position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);
            display:flex;align-items:center;justify-content:center;
            cursor:zoom-out;opacity:0;transition:opacity 0.25s ease;`,e.innerHTML=`
            <img src="${t}" width="800" height="600" decoding="async" style="max-width:94vw;max-height:94vh;object-fit:contain;
                border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.6);
                transform:scale(0.95);transition:transform 0.25s ease;">
            <button type="button" onclick="UpcomingEvents.closeLightbox()"
                    aria-label="Close lightbox"
                    style="position:absolute;top:18px;right:22px;background:none;border:none;
                           cursor:pointer;font-size:28px;color:#fff;opacity:0.7;line-height:1;">✕</button>`,document.body.appendChild(e),document.body.style.overflow="hidden",requestAnimationFrame(()=>{e.style.opacity="1",e.querySelector("img").style.transform="scale(1)"}),e.addEventListener("click",i=>{i.target===e&&this.closeLightbox()}),this._lightboxEsc=i=>{i.key==="Escape"&&this.closeLightbox()},document.addEventListener("keydown",this._lightboxEsc)},closeLightbox(){const t=document.getElementById("flyerLightbox");t&&(t.style.opacity="0",setTimeout(()=>{t.remove(),document.body.style.overflow=""},250),this._lightboxEsc&&(document.removeEventListener("keydown",this._lightboxEsc),this._lightboxEsc=null))},initRotation(){this.destroy();const t=(e,i=0)=>{const o=this.config.CARDS[e],n=()=>{this.state[o.stateKey]=(this.state[o.stateKey]+1)%this[e].length,this.updateCard(e,this.state[o.stateKey])};i?this._staggerTimeout=setTimeout(()=>{this.state[o.intervalKey]=setInterval(n,this.config.ROTATION_INTERVAL)},i):this.state[o.intervalKey]=setInterval(n,this.config.ROTATION_INTERVAL)};t("classes"),t("sessions",this.config.ROTATION_INTERVAL/2)},updateCard(t,e){const i=this.config.CARDS[t],o=this[t][e],n=document.getElementById(i.imageId),r=document.getElementById(i.contentId);if(!n||!r){console.warn(`[UpcomingEvents] Elements not found: ${i.imageId} or ${i.contentId}`);return}n.style.opacity="0",setTimeout(()=>{n.src=o.image,n.alt=o.title,r.innerHTML=this._getContentHTML(o,i.contentId,i.ctaText),this._updateDots(i.cardSelector,e),n.style.opacity="1"},this.config.FADE_DURATION)},_updateDots(t,e){var i;(i=document.querySelector(t))==null||i.querySelectorAll(".dot").forEach((o,n)=>{const r=n===e;o.style.opacity=r?"1":"0.5",o.classList.toggle("active",r)})},async render(){if(this.state.isInitialized){console.warn("UpcomingEvents already initialized");return}const t=document.getElementById("upcomingEventsContainer");if(!t){console.warn("upcomingEventsContainer not found - skipping render");return}try{if(u!=null&&u.ready){const e=await u.getAppSettings("upcoming_events");e&&(["classes0","classes1","sessions0","sessions1"].forEach(i=>{if(e[i]){const[o,n]=[i.slice(0,-1),+i.slice(-1)];this[o][n]={...this[o][n],...e[i]}}}),!e.classes0&&e.classes&&(this.classes[0]={...this.classes[0],...e.classes}),!e.sessions0&&e.sessions&&(this.sessions[0]={...this.sessions[0],...e.sessions}))}t.innerHTML=this.getHTML(),setTimeout(()=>this.initRotation(),100),this.state.isInitialized=!0}catch(e){console.error("UpcomingEvents render error:",e)}},injectAdminUI(){var n,r,a;const t=(a=(r=(n=window.Core)==null?void 0:n.state)==null?void 0:r.currentUser)==null?void 0:a.is_admin,e=document.getElementById("upcomingAdminBtn");if(e){e.style.display=t?"inline-block":"none";return}if(!t)return;const i=document.querySelector("#upcomingEventsContainer .section-header");if(!i)return;const o=document.createElement("button");o.id="upcomingAdminBtn",o.className="btn btn-primary upcoming-admin-btn",o.type="button",o.setAttribute("aria-label","Update event flyers"),o.onclick=()=>pt.openAdminModal(),o.style.cssText="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;",o.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Update Flyers',i.appendChild(o)},destroy(){clearTimeout(this._staggerTimeout),clearInterval(this.state.classInterval),clearInterval(this.state.sessionInterval),this._staggerTimeout=null,this.state.classInterval=null,this.state.sessionInterval=null,this.state.isInitialized=!1},openAdminModal(){if(document.getElementById("eventsAdminModal"))return;this._adminDraft={classes0:{...this.classes[0]},classes1:{...this.classes[1]},sessions0:{...this.sessions[0]},sessions1:{...this.sessions[1]}},this._adminActiveTab="classes0";const t=document.createElement("div");t.id="eventsAdminModal",t.style.cssText=`position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);
            backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;`,t.innerHTML=this._getAdminModalHTML(),document.body.appendChild(t),document.body.style.overflow="hidden",t.addEventListener("click",e=>{e.target===t&&this.closeAdminModal()}),this._renderAdminTab("classes0")},closeAdminModal(){var t;(t=document.getElementById("eventsAdminModal"))==null||t.remove(),document.body.style.overflow=""},_getAdminModalHTML(){return`
        <div style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:24px;
                    max-width:560px;width:94%;max-height:90vh;overflow-y:auto;position:relative;
                    box-shadow:8px 8px 20px rgba(0,0,0,0.2);">
            <button type="button" onclick="UpcomingEvents.closeAdminModal()"
                    aria-label="Close admin modal"
                    style="position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;">✕</button>
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                        color:var(--neuro-accent);margin-bottom:16px;" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Update Flyers</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
                ${this.config.ADMIN_TABS.map((e,i)=>`
                <button type="button" id="adminTab_${e.id}" onclick="UpcomingEvents._switchAdminTab('${e.id}')" aria-pressed="${i===0}"
                        style="padding:9px;border-radius:10px;border:none;cursor:pointer;font-size:0.82rem;font-weight:600;
                               ${i===0?"background:var(--neuro-accent);color:#fff;":"background:var(--neuro-accent-a10);color:var(--neuro-accent);"}">
                    ${e.label}
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
        </div>`},_switchAdminTab(t){this._readAdminFields(this._adminActiveTab),this._adminActiveTab=t,this.config.ADMIN_TABS.forEach(({id:e})=>{const i=document.getElementById(`adminTab_${e}`);if(!i)return;const o=e===t;i.style.background=o?"var(--neuro-accent)":"var(--neuro-accent-a10)",i.style.color=o?"#fff":"var(--neuro-accent)"}),this._renderAdminTab(t)},_renderAdminTab(t){const e=document.getElementById("adminTabContent");if(!e)return;const i=this._adminDraft[t],{Sessions:o,Workshops:n}=this.config.FLYER_FILES,r=(l,d)=>d.map(c=>{const p=this._flyerBase+l+"/"+c,h=i.image===p;return`<button type="button" onclick="UpcomingEvents._selectFlyer('${t}','${p}','${c}')"
                         style="cursor:pointer;border-radius:8px;overflow:hidden;
                                border:3px solid ${h?"var(--neuro-accent)":"transparent"};
                                transition:border 0.15s;">
                        <img src="${p}" alt="${c}" loading="lazy" decoding="async" style="width:100%;height:auto;display:block;">
                    </button>`}).join(""),a={classes0:"Left Card - Flyer 1",classes1:"Left Card - Flyer 2",sessions0:"Right Card - Flyer 1",sessions1:"Right Card - Flyer 2"},s=`padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                            font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);
                            width:100%;box-sizing:border-box;`;e.innerHTML=`
            <div style="font-size:0.78rem;font-weight:700;color:var(--neuro-accent);margin-bottom:12px;
                        text-transform:uppercase;letter-spacing:0.5px;">Editing: ${a[t]}</div>
            <div style="margin-bottom:14px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:8px;">Sessions</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${r("Sessions",o)}</div>
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:14px 0 8px;">Workshops</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${r("Workshops",n)}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <input id="adminField_title"    placeholder="Title"    value="${this.escapeHtml(i.title||"")}"    style="${s}">
                <input id="adminField_subtitle" placeholder="Subtitle" value="${this.escapeHtml(i.subtitle||"")}" style="${s}">
                <textarea id="adminField_info"  placeholder="Description" rows="3" style="${s}resize:vertical;">${this.escapeHtml(i.info||"")}</textarea>
                <input id="adminField_type"     placeholder="Type (e.g. 🎴 Online Zoom Class)"         value="${this.escapeHtml(i.type||"")}"     style="${s}">
                <input id="adminField_datetime" placeholder="Date & Time (e.g. Monday, 10:00 AM GMT+2)" value="${this.escapeHtml(i.datetime||"")}" style="${s}">
            </div>`},_selectFlyer(t,e,i){const o=this.flyerCatalog[i]||{},n=this._adminDraft[t];this._adminDraft[t]={...n,image:e,title:o.title||n.title,subtitle:o.subtitle||n.subtitle,info:o.info||n.info,type:o.type||n.type},this._renderAdminTab(t)},_readAdminFields(t){if(!document.getElementById("adminField_title"))return;const e=i=>{var o,n;return((n=(o=document.getElementById(i))==null?void 0:o.value)==null?void 0:n.trim())||""};this._adminDraft[t]={...this._adminDraft[t],title:e("adminField_title"),subtitle:e("adminField_subtitle"),info:e("adminField_info"),type:e("adminField_type"),datetime:e("adminField_datetime")}},async _adminSave(){const t=document.querySelector('#eventsAdminModal button[onclick*="_adminSave"]');t&&(t.disabled=!0,t.textContent="Saving..."),this._readAdminFields(this._adminActiveTab);try{const e={classes0:this._adminDraft.classes0,classes1:this._adminDraft.classes1,sessions0:this._adminDraft.sessions0,sessions1:this._adminDraft.sessions1};if(!await u.saveAppSettings("upcoming_events",e))throw new Error("saveAppSettings returned false");["classes0","classes1","sessions0","sessions1"].forEach(o=>{const[n,r]=[o.slice(0,-1),+o.slice(-1)];Object.assign(this[n][r],this._adminDraft[o])}),this.updateCard("classes",this.state.classIndex),this.updateCard("sessions",this.state.sessionIndex),window.Core.showToast("Flyers updated for all users"),this.closeAdminModal()}catch(e){console.error("_adminSave error:",e),window.Core.showToast("Could not save - please try again"),t&&(t.disabled=!1,t.textContent="Save & Publish")}},openWhatsApp(t){t&&window.open(t,"_blank","noopener,noreferrer")},escapeHtml(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}};window.UpcomingEvents=pt;const Je=["Enter with intention, leave with gratitude","This space holds you. Enter with presence.","Breathe in. You are welcome here.","Leave the noise behind. Step into stillness.","You are exactly where you need to be.","Enter gently. This moment is yours.","Set down what you carry. Enter with an open heart.","The space is ready. So are you.","Come as you are. This is a place of welcome.","Arrive fully. Begin with intention."];class ti{constructor(e){this.app=e,this.initialized=!1,this._activeMembersWidget=null}async render(){const e=document.getElementById("community-hub-tab");if(!e){console.error("[CommunityHub] Tab element not found");return}if(this.createFullscreenRoomContainer(),this.initialized||(e.innerHTML=this._buildTabHTML()),requestAnimationFrame(()=>requestAnimationFrame(()=>this._showRitualImmediately())),this.initialized?this._refreshHubPresence():(await this.initializeCommunityHub(),this.initialized=!0),this._attachHubVisibility(),window._pendingHubScrollTarget){const i=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,requestAnimationFrame(()=>requestAnimationFrame(()=>{const o=document.getElementById(i);o&&o.scrollIntoView({behavior:"smooth",block:"start"})}))}if(window._pendingRoomOpen){const i=window._pendingRoomOpen;window._pendingRoomOpen=null;const o=window[`${i}_enterRoom`];if(typeof o=="function")o();else{const n=r=>{var a,s;((a=r.detail)==null?void 0:a.roomKey)===i&&(document.removeEventListener("practiceRoomReady",n),(s=window[`${i}_enterRoom`])==null||s.call(window))};document.addEventListener("practiceRoomReady",n),setTimeout(()=>document.removeEventListener("practiceRoomReady",n),8e3)}}}_buildTabHTML(){return`
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
    `}_buildCandleSVG(e){return`
      <svg viewBox="0 0 48 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="flame-outer" cx="24" cy="16" rx="7" ry="11" fill="url(#flameGradOuter-${e})" opacity="0.9"/>
        <ellipse class="flame-inner" cx="24" cy="18" rx="4.5" ry="7.5" fill="url(#flameGradInner-${e})" opacity="0.95"/>
        <ellipse class="flame-core"  cx="24" cy="20" rx="2" ry="3.5" fill="#fff9e6" opacity="0.95"/>
        <line x1="24" y1="26" x2="24" y2="29" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="14" y="29" width="20" height="34" rx="3" fill="url(#candleGrad-${e})"/>
        <path d="M14 35 Q11 38 12 43 Q13 46 14 48 L14 35Z" fill="url(#dripGrad-${e})" opacity="0.7"/>
        <path d="M34 38 Q37 41 36 46 Q35 48 34 49 L34 38Z" fill="url(#dripGrad-${e})" opacity="0.5"/>
        <ellipse cx="24" cy="29" rx="10" ry="2.5" fill="url(#topGrad-${e})"/>
        <rect x="17" y="31" width="4" height="28" rx="2" fill="white" opacity="0.08"/>
        <defs>
          <radialGradient id="flameGradOuter-${e}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#ffe066"/>
            <stop offset="50%"  stop-color="#ff9a00"/>
            <stop offset="100%" stop-color="#ff4400" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameGradInner-${e}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#fff5c0"/>
            <stop offset="60%"  stop-color="#ffb830"/>
            <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="candleGrad-${e}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#c8a882"/>
            <stop offset="40%"  stop-color="#e8d0b0"/>
            <stop offset="70%"  stop-color="#d4b88a"/>
            <stop offset="100%" stop-color="#b89060"/>
          </linearGradient>
          <linearGradient id="dripGrad-${e}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#e8d0b0"/>
            <stop offset="100%" stop-color="#c8a882" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="topGrad-${e}" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#f0dfc0"/>
            <stop offset="100%" stop-color="#c8a882"/>
          </radialGradient>
        </defs>
      </svg>`}_buildRitualCard({id:e,textId:i,type:o,action:n,label:r,buttonText:a}){return`
      <div class="ritual-overlay ${o}" id="${e}" role="dialog" aria-modal="true" aria-labelledby="${i}">
        <div class="ritual-card">
          <div class="ritual-candle" aria-hidden="true">${this._buildCandleSVG(o[0])}</div>
          <div class="ritual-text" id="${i}"></div>
          <button class="ritual-btn" data-action="${n}" aria-label="${r}">${a}</button>
        </div>
      </div>`}createFullscreenRoomContainer(){if(document.getElementById("communityHubFullscreenContainer"))return;const e=document.createElement("div");if(e.id="communityHubFullscreenContainer",e.style.cssText="position:fixed;inset:0;z-index:99999;background:transparent;display:none;overflow:auto;pointer-events:auto;",e.innerHTML=`
      ${this._buildRitualCard({id:"closingOverlay",textId:"closingRitualText",type:"closing",action:"ritual-closing",label:"Close gently",buttonText:"Close Gently"})}
      <div id="dynamicRoomContent" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;width:100%;"></div>
    `,document.body.appendChild(e),!document.getElementById("openingOverlay")){const i=document.createElement("div");i.innerHTML=this._buildRitualCard({id:"openingOverlay",textId:"openingRitualText",type:"opening",action:"ritual-opening",label:"Enter the space",buttonText:"Enter the Space"}),(document.getElementById("app-container")||document.body).appendChild(i.firstElementChild)}}_showRitualImmediately(){var o,n;if((n=(o=window.Rituals)==null?void 0:o.state)!=null&&n.hasSeenOpening)return;const e=document.getElementById("openingOverlay");if(!e)return;const i=document.getElementById("openingRitualText");i&&(i.textContent=`"${Je[Math.floor(Math.random()*Je.length)]}"`),document.body.classList.add("ritual-active"),e.classList.add("active"),setTimeout(()=>{window.Rituals?window.Rituals.completeOpening():(e.classList.remove("active"),document.body.classList.remove("ritual-active"))},5e3)}_refreshHubPresence(){var e,i,o,n;try{(e=this._activeMembersWidget)==null||e.refresh(),(o=(i=window.PracticeRoom)==null?void 0:i._hubRooms)!=null&&o.length&&PracticeRoom.startHubPresence(),(n=window.CollectiveFieldDB)!=null&&n.refreshCount&&window.CollectiveFieldDB.refreshCount()}catch(r){console.warn("[CommunityHub] _refreshHubPresence fallback to Core.init",r),w.state.initialized=!1,w.init()}}_preloadYouTubeAPI(){var i;if((i=window.YT)!=null&&i.Player||document.querySelector('script[src*="youtube.com/iframe_api"]'))return;const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",e.async=!0,document.head.appendChild(e)}_attachHubVisibility(){this._hubVisibilityHandler||(this._hubVisibilityHandler=()=>{var e,i;if(document.hidden)(e=this._hubChatRooms)==null||e.forEach(o=>{try{u.unsubscribeFromRoomChat(o)}catch{}});else{const o=(i=w==null?void 0:w.state)==null?void 0:i.currentRoom;o&&this._hubChatResubscribe&&this._hubChatResubscribe(o)}},document.addEventListener("visibilitychange",this._hubVisibilityHandler))}registerHubChatRooms(e,i){this._hubChatRooms=e,this._hubChatResubscribe=i}loadStylesheet(e,{critical:i=!1}={}){if(document.querySelector(`link[href="${e}"]`))return;const o=document.createElement("link");o.rel="stylesheet",o.href=e,i||(o.rel="preload",o.as="style",o.onload=function(){this.rel="stylesheet"}),document.head.appendChild(o)}loadScript(e){return new Promise((i,o)=>{if(document.querySelector(`script[src="${e}"]`))return i();const n=Object.assign(document.createElement("script"),{src:e,async:!0});n.onload=i,n.onerror=()=>o(new Error(`Failed to load: ${e}`)),document.body.appendChild(n)})}async initializeCommunityHub(){var e,i,o,n,r;try{if(this._preloadYouTubeAPI(),(i=(e=window.LunarEngine)==null?void 0:e.init)==null||i.call(e),!(w!=null&&w.init))throw new Error("Core module not found");await u.init(),window.CommunityDB=u,await w.init(),window.Core=w;const a=document.getElementById("activeMembersContainer");if(a&&(this._activeMembersWidget&&this._activeMembersWidget.destroy(),this._activeMembersWidget=new Ct(a),this._activeMembersWidget.render()),(o=window.CollectiveField)==null||o.render(),(n=window.Resonance)==null||n.render(),(r=window.UpcomingEvents)==null||r.render(),window.ProfileModule){window.ProfileModule.state.isInitialized=!1;try{window.ProfileModule.init()}catch(s){console.warn("[CommunityHub] ProfileModule re-init:",s)}}if(window.CommunityModule){window.CommunityModule.state.isInitialized=!1;try{window.CommunityModule.init()}catch(s){console.warn("[CommunityHub] CommunityModule re-init:",s)}}if(window.Rituals&&(window.Rituals.state.hasSeenOpening=!1),window.CollectiveFieldDB&&await window.CollectiveFieldDB.init(),window._pendingHubScrollTarget){const s=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,requestAnimationFrame(()=>requestAnimationFrame(()=>{const l=document.getElementById(s);l&&l.scrollIntoView({behavior:"smooth",block:"start"})}))}}catch(a){console.error("❌ Failed to load Community Hub:",a);const s=document.getElementById("community-hub-main-content");s&&(s.innerHTML=`
          <div class="card" style="text-align:center; padding:var(--spacing-xl)">
            <h3 style="color:var(--neuro-text)">Failed to Load</h3>
            <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
            <p style="color:var(--neuro-text-lighter); font-size:0.9rem; margin-top:1rem">${a.message}</p>
          </div>`)}}destroy(){this._activeMembersWidget&&(this._activeMembersWidget.destroy(),this._activeMembersWidget=null),this._hubVisibilityHandler&&(document.removeEventListener("visibilitychange",this._hubVisibilityHandler),this._hubVisibilityHandler=null)}}export{Ct as A,ti as C,Ce as L,Ht as S,xt as W,ue as _,w as a,u as b,Ot as c,Nt as d,be as e,Ut as f};
