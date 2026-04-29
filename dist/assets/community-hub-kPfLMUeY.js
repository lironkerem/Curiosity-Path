import"./vendor-suncalc-C01ALbtn.js";const h=window.AppSupabase||null;window.CommunitySupabase=h;const o={_sb:null,_uid:null,_subs:{},_heartbeatTimer:null,async init(){if(this._sb=window.AppSupabase||h,!this._sb)return console.error("[CommunityDB] CommunitySupabase not ready — window.AppSupabase is null"),!1;const{data:{user:e},error:t}=await this._sb.auth.getUser();return t||!e?(console.error("[CommunityDB] No authenticated user:",t?.message),!1):(this._uid=e.id,!0)},get userId(){return this._uid},get ready(){return!!(this._sb&&this._uid)},_err(e,t){console.error(`[CommunityDB] ${e}:`,t?.message??t)},_profileSelect:"id, name, emoji, avatar_url",_ago(e){return new Date(Date.now()-e).toISOString()},_todayUTC(){const e=new Date;return e.setUTCHours(0,0,0,0),e.toISOString()},async getMyProfile(){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("profiles").select("*").eq("id",this._uid).single();return t?(this._err("getMyProfile",t),null):e},async getProfile(e){if(!this.ready)return null;const{data:t,error:r}=await this._sb.from("profiles").select("id, name, emoji, avatar_url, inspiration, community_status, community_role, total_sessions, total_minutes, gifts_given, birthday, country").eq("id",e).single();return r?(this._err("getProfile",r),null):t},_parseProgress(e){const t=typeof e=="string"?JSON.parse(e):e;return{xp:t.xp??0,karma:t.karma??0,level:t.level??1,badges:t.badges??[],unlockedFeatures:t.unlockedFeatures??[],streak:t.streaks?.current??t.streak?.current??0,longestStreak:t.streaks?.longest??0,totalSessions:t.stats?.totalSessions??0,totalMeditations:t.stats?.totalMeditations??0,totalReadings:t.stats?.totalReadings??0,totalTarotSpreads:t.totalTarotSpreads??0,totalJournalEntries:t.totalJournalEntries??0,totalWellnessRuns:t.totalWellnessRuns??0,totalHappinessViews:t.totalHappinessViews??0}},async getUserProgress(e){if(!this.ready)return null;try{const{data:t,error:r}=await this._sb.from("user_progress").select("payload").eq("user_id",e).single();return r||!t?null:this._parseProgress(t.payload)}catch(t){return this._err("getUserProgress",t),null}},getOwnGamificationState(){const e=window.app?.gamification;return e?this._parseProgress(e.state??e):null},async uploadAvatar(e){if(!this.ready)return null;try{const t=e.name.split(".").pop().toLowerCase()||"jpg",r=`avatars/${this._uid}.${t}`,{error:s}=await this._sb.storage.from("community-avatars").upload(r,e,{upsert:!0,contentType:e.type});if(s)return this._err("uploadAvatar upload",s),null;const{data:i}=this._sb.storage.from("community-avatars").getPublicUrl(r),a=i?.publicUrl;if(!a)return null;const l=`${a}?t=${Date.now()}`;return await this.updateProfile({avatar_url:l})?l:null}catch(t){return this._err("uploadAvatar",t),null}},async updateProfile(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("profiles").update({...e,updated_at:new Date().toISOString()}).eq("id",this._uid);return t?(this._err("updateProfile",t),!1):!0},async setPresence(e="online",t="✨ Available",r=null){if(!this.ready)return!1;const s=new Date().toISOString(),{error:i}=await this._sb.from("community_presence").upsert({user_id:this._uid,status:e,activity:t,room_id:r,last_seen:s,updated_at:s},{onConflict:"user_id"});return i&&this._err("setPresence",i),!i},async setOffline(){return this.setPresence("offline","💤 Offline",null)},async getActiveMembers(){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!1});return t?(this._err("getActiveMembers",t),[]):e||[]},async getRoomParticipants(e){if(!this.ready)return[];const{data:t,error:r}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).or(`room_id.eq.${e},is_phantom.eq.true`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!0});return r?(this._err("getRoomParticipants",r),[]):t||[]},subscribeToPresence(e){return this._subs.presence&&this._subs.presence.unsubscribe(),this._subs.presence=this._sb.channel("community-presence").on("postgres_changes",{event:"*",schema:"public",table:"community_presence"},async()=>e(await this.getActiveMembers())).subscribe(),this._subs.presence},startHeartbeat(e=6e4){this.stopHeartbeat(),this._heartbeatTimer=setInterval(async()=>{if(!this.ready)return;const t=(typeof Core<"u"?Core:window.Core)?.state;await this.setPresence(t?.currentUser?.status||"online",t?.currentUser?.activity||"✨ Available",t?.currentRoom||null)},e),window.addEventListener("beforeunload",()=>this._cleanup())},stopHeartbeat(){this._heartbeatTimer&&(clearInterval(this._heartbeatTimer),this._heartbeatTimer=null)},_reflectionSelect:"id, content, appreciation_count, created_at, profiles ( id, name, emoji, avatar_url )",async getReflections(e=30){if(!this.ready)return[];const{data:t,error:r}=await this._sb.from("reflections").select(this._reflectionSelect).order("created_at",{ascending:!1}).limit(e);return r?(this._err("getReflections",r),[]):t||[]},async postReflection(e){if(!this.ready)return null;const{data:t,error:r}=await this._sb.from("reflections").insert({user_id:this._uid,content:e}).select(this._reflectionSelect).single();return r?(this._err("postReflection",r),null):t},async deleteReflection(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("reflections").delete().eq("id",e);return t?(this._err("deleteReflection",t),!1):!0},async updateReflection(e,t){if(!this.ready)return!1;const{error:r}=await this._sb.from("reflections").update({content:t}).eq("id",e).eq("user_id",this._uid);return r?(this._err("updateReflection",r),!1):!0},subscribeToReflections(e){return this._subs.reflections&&this._subs.reflections.unsubscribe(),this._subs.reflections=this._sb.channel("community-reflections").on("postgres_changes",{event:"INSERT",schema:"public",table:"reflections"},async({new:t})=>{const{data:r}=await this._sb.from("reflections").select(this._reflectionSelect).eq("id",t.id).single();r&&e(r)}).subscribe(),this._subs.reflections},async getMyAppreciations(){if(!this.ready)return new Set;const{data:e,error:t}=await this._sb.from("appreciations").select("reflection_id").eq("user_id",this._uid);return t?(this._err("getMyAppreciations",t),new Set):new Set(e.map(r=>r.reflection_id))},async toggleAppreciation(e,t){if(!this.ready)return null;if(t){const{error:r}=await this._sb.from("appreciations").delete().eq("user_id",this._uid).eq("reflection_id",e);return r?(this._err("removeAppreciation",r),null):{appreciated:!1}}else{const{error:r}=await this._sb.from("appreciations").insert({user_id:this._uid,reflection_id:e});return r?(this._err("addAppreciation",r),null):{appreciated:!0}}},async getReflectionCount(e){if(!this.ready)return null;const{data:t,error:r}=await this._sb.from("reflections").select("appreciation_count").eq("id",e).single();return r?(this._err("getReflectionCount",r),null):t?.appreciation_count??null},async getMyUserAppreciations(){if(!this.ready)return new Set;const{data:e,error:t}=await this._sb.from("user_appreciations").select("appreciated_user_id").eq("user_id",this._uid);return t?(this._err("getMyUserAppreciations",t),new Set):new Set(e.map(r=>r.appreciated_user_id))},async toggleUserAppreciation(e,t){if(!this.ready)return null;if(t){const{error:r}=await this._sb.from("user_appreciations").delete().eq("user_id",this._uid).eq("appreciated_user_id",e);return r?(this._err("removeUserAppreciation",r),null):{appreciated:!1}}else{const{error:r}=await this._sb.from("user_appreciations").insert({user_id:this._uid,appreciated_user_id:e});return r?(this._err("addUserAppreciation",r),null):{appreciated:!0}}},async getUserAppreciationCount(e){if(!this.ready)return 0;const{count:t,error:r}=await this._sb.from("user_appreciations").select("*",{count:"exact",head:!0}).eq("appreciated_user_id",e);return r?(this._err("getUserAppreciationCount",r),0):t||0},_roomMsgSelect:"id, message, created_at, profiles ( id, name, emoji, avatar_url )",async getRoomMessages(e,t=50){if(!this.ready)return[];const{data:r,error:s}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("room_id",e).order("created_at",{ascending:!0}).limit(t);return s?(this._err("getRoomMessages",s),[]):r||[]},async sendRoomMessage(e,t){if(!this.ready)return null;const{data:r,error:s}=await this._sb.from("room_messages").insert({user_id:this._uid,room_id:e,message:t}).select(this._roomMsgSelect).single();return s?(this._err("sendRoomMessage",s),null):r},subscribeToRoomChat(e,t){const r=`room-${e}`;return this._subs[r]&&this._subs[r].unsubscribe(),this._subs[r]=this._sb.channel(`room-chat-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_messages",filter:`room_id=eq.${e}`},async({new:s})=>{const{data:i}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("id",s.id).single();i&&t(i)}).subscribe(),this._subs[r]},unsubscribeFromRoomChat(e){this._unsub(`room-${e}`)},async sendWhisper(e,t){if(!this.ready)return null;const{data:r,error:s}=await this._sb.from("whispers").insert({sender_id:this._uid,recipient_id:e,message:t}).select().single();return s?(this._err("sendWhisper",s),null):r},async getWhispers(e){if(!this.ready)return[];const{data:t,error:r}=await this._sb.from("whispers").select(`
                id, message, read, created_at,
                sender:profiles!whispers_sender_id_fkey ( id, name, emoji ),
                recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji )
            `).or(`and(sender_id.eq.${this._uid},recipient_id.eq.${e}),and(sender_id.eq.${e},recipient_id.eq.${this._uid})`).order("created_at",{ascending:!0});return r?(this._err("getWhispers",r),[]):t||[]},async markWhisperRead(e){this.ready&&await this._sb.from("whispers").update({read:!0}).eq("id",e)},async markConversationRead(e){if(!this.ready)return;const{error:t}=await this._sb.from("whispers").update({read:!0}).eq("recipient_id",this._uid).eq("sender_id",e).eq("read",!1);t&&this._err("markConversationRead",t)},async getWhisperInbox(){if(!this.ready)return[];try{const{data:e,error:t}=await this._sb.from("whispers").select(`
                    id, message, read, created_at, sender_id, recipient_id,
                    sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url ),
                    recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji, avatar_url )
                `).or(`sender_id.eq.${this._uid},recipient_id.eq.${this._uid}`).order("created_at",{ascending:!1}).limit(200);if(t)return this._err("getWhisperInbox",t),[];const r={};for(const s of e||[]){const i=s.sender_id===this._uid?s.recipient_id:s.sender_id,a=s.sender_id===this._uid?s.recipient:s.sender;r[i]||(r[i]={partnerId:i,partner:a,lastMessage:s.message,lastAt:s.created_at,unread:0}),s.recipient_id===this._uid&&!s.read&&r[i].unread++}return Object.values(r).sort((s,i)=>new Date(i.lastAt)-new Date(s.lastAt))}catch(e){return this._err("getWhisperInbox",e),[]}},async getUnreadWhisperCount(){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("whispers").select("id",{count:"exact",head:!0}).eq("recipient_id",this._uid).eq("read",!1);return t?0:e||0},subscribeToWhispers(e){return this._subs.whispersFg&&this._subs.whispersFg.unsubscribe(),this._subs.whispersFg=this._sb.channel("my-whispers-fg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:t})=>{const{data:r}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",t.id).single();r&&e(r)}).subscribe(),this._subs.whispersFg},subscribeToWhispersBackground(e){return this._subs.whispersBg&&this._subs.whispersBg.unsubscribe(),this._subs.whispersBg=this._sb.channel("my-whispers-bg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:t})=>{const{data:r}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",t.id).single();r&&e(r)}).subscribe(),this._subs.whispersBg},async submitReport(e,t,r=""){if(!this.ready)return!1;const{error:s}=await this._sb.from("reports").insert({reporter_id:this._uid,reported_user_id:e,reason:t,details:r});return s?(this._err("submitReport",s),!1):!0},async blockUser(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("blocked_users").insert({user_id:this._uid,blocked_user_id:e});return t?(this._err("blockUser",t),!1):!0},async getBlockedUsers(){if(!this.ready)return new Set;const{data:e,error:t}=await this._sb.from("blocked_users").select("blocked_user_id").eq("user_id",this._uid);return t?new Set:new Set(e.map(r=>r.blocked_user_id))},async getUserByName(e){if(!this.ready)return null;const{data:t,error:r}=await this._sb.from("profiles").select("id, name").ilike("name",e).single();return r?(this._err("getUserByName",r),null):t},async getOwnFullProgress(){if(!this.ready)return null;try{const{data:e,error:t}=await this._sb.from("user_progress").select("payload").eq("user_id",this._uid).single();if(t||!e)return null;const r=typeof e.payload=="string"?JSON.parse(e.payload):e.payload;return{journalEntries:r.journalEntries||[],energyEntries:r.energyEntries||[],gratitudeEntries:r.gratitudeEntries||[],flipEntries:r.flipEntries||[],tarotReadings:r.tarotReadings||[],meditationEntries:r.meditationEntries||[]}}catch(e){return this._err("getOwnFullProgress",e),null}},async getRoomBlessings(e){if(!this.ready)return[];const{data:t,error:r}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",e).order("created_at",{ascending:!1});return r?(this._err("getRoomBlessings",r),[]):t||[]},async blessRoom(e){if(!this.ready)return{status:"error"};const{data:t,error:r}=await this._sb.rpc("bless_room_with_cooldown",{p_room_id:e,p_cooldown_seconds:60});if(r)return this._err("blessRoom rpc",r),{status:"error"};if(t==="cooldown")return{status:"cooldown"};if(t!=="ok")return{status:"error"};const{data:s,error:i}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",e).eq("user_id",this._uid).single();return i?(this._err("blessRoom fetch",i),{status:"ok",data:null}):{status:"ok",data:s}},subscribeToBlessings(e,t){const r=`bless-${e}`;this._subs[r]&&this._subs[r].unsubscribe();const s=async({new:i})=>{if(!i?.user_id)return;const{data:a}=await this._sb.from("profiles").select("name, avatar_url, emoji").eq("id",i.user_id).single();t({roomId:e,userId:i.user_id,name:a?.name||"A member",avatarUrl:a?.avatar_url||"",emoji:a?.emoji||""})};return this._subs[r]=this._sb.channel(r).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_blessings",filter:`room_id=eq.${e}`},s).on("postgres_changes",{event:"UPDATE",schema:"public",table:"room_blessings",filter:`room_id=eq.${e}`},s).subscribe(),this._subs[r]},unsubscribeFromBlessings(e){this._unsub(`bless-${e}`)},async getAppSettings(e){if(!this.ready)return null;const{data:t,error:r}=await this._sb.from("app_settings").select("value").eq("key",e).single();return r?(this._err("getAppSettings",r),null):t?.value??null},async saveAppSettings(e,t){if(!this.ready)return!1;const{error:r}=await this._sb.from("app_settings").upsert({key:e,value:t,updated_at:new Date().toISOString()},{onConflict:"key"});return r?(this._err("saveAppSettings",r),!1):!0},async logRoomEntry(e){if(!this.ready)return null;const{data:t,error:r}=await this._sb.from("room_entries").insert({user_id:this._uid,room_id:e}).select("id").single();return r?(this._err("logRoomEntry",r),null):t?.id||null},async logRoomExit(e){if(!e||!this.ready)return;const{data:t}=await this._sb.from("room_entries").select("entered_at").eq("id",e).single();if(!t)return;const r=Math.round((Date.now()-new Date(t.entered_at).getTime())/1e3);await this._sb.from("room_entries").update({left_at:new Date().toISOString(),duration_seconds:r}).eq("id",e)},async broadcastMessage(e,t){if(!this.ready||!e?.length)return{sent:0,failed:0};const r=e.map(a=>({sender_id:this._uid,recipient_id:a,message:t})),{data:s,error:i}=await this._sb.from("whispers").insert(r).select("id");return i?(this._err("broadcastMessage",i),{sent:0,failed:e.length}):{sent:s?.length||0,failed:e.length-(s?.length||0)}},async getAdminNotifications(e=50){if(!this.ready)return[];const{data:t,error:r}=await this._sb.from("admin_notifications").select("*").order("created_at",{ascending:!1}).limit(e);return r?(this._err("getAdminNotifications",r),[]):t||[]},async markNotificationRead(e){if(!this.ready)return!1;const{error:t}=await this._sb.from("admin_notifications").update({read:!0}).eq("id",e);return t?(this._err("markNotificationRead",t),!1):!0},async markAllNotificationsRead(){if(!this.ready)return!1;const{error:e}=await this._sb.from("admin_notifications").update({read:!0}).eq("read",!1);return e?(this._err("markAllNotificationsRead",e),!1):!0},async getUnreadNotificationCount(){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1);return t?(this._err("getUnreadNotificationCount",t),0):e||0},async getAdminMemberStats(){if(!this.ready)return{};const[e,t,r]=await Promise.all([this._sb.from("profiles").select("*",{count:"exact",head:!0}),this._sb.from("profiles").select("*",{count:"exact",head:!0}).gte("updated_at",this._ago(10080*6e4)),this._sb.from("community_presence").select("*",{count:"exact",head:!0}).neq("status","offline").gte("last_seen",this._ago(5*6e4))]);return{total:e.count||0,newThisWeek:t.count||0,onlineNow:r.count||0}},async getAdminEngagementStats(){if(!this.ready)return{};const e=this._todayUTC(),[t,r,s,i]=await Promise.all([this._sb.from("reflections").select("*",{count:"exact",head:!0}).gte("created_at",e),this._sb.from("reflections").select("*",{count:"exact",head:!0}),this._sb.from("whispers").select("*",{count:"exact",head:!0}).gte("created_at",e),this._sb.from("appreciations").select("*",{count:"exact",head:!0}).gte("created_at",e)]);return{reflectionsToday:t.count||0,reflectionsTotal:r.count||0,whispersToday:s.count||0,appreciationsToday:i.count||0}},async getLeaderboard(){if(!this.ready)return{xp:[],karma:[]};const{data:e,error:t}=await this._sb.from("user_progress").select("user_id, payload->xp, payload->karma, payload->level").limit(50);if(t)return this._err("getLeaderboard",t),{xp:[],karma:[]};const r=(e||[]).map(n=>n.user_id);if(!r.length)return{xp:[],karma:[]};const{data:s}=await this._sb.from("profiles").select("id, name, emoji, avatar_url").in("id",r),i=Object.fromEntries((s||[]).map(n=>[n.id,n])),a=(e||[]).filter(n=>i[n.user_id]).map(n=>({user_id:n.user_id,profiles:i[n.user_id],payload:{xp:n.xp??0,karma:n.karma??0,level:n.level??1}})),l=n=>[...a].sort((c,d)=>(d.payload?.[n]||0)-(c.payload?.[n]||0)).slice(0,3);return{xp:l("xp"),karma:l("karma")}},async getRoomUsageToday(){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("room_entries").select("room_id, duration_seconds").gte("entered_at",this._todayUTC());if(t)return this._err("getRoomUsageToday",t),[];const r={};for(const s of e||[])r[s.room_id]||(r[s.room_id]={room_id:s.room_id,entries:0,totalSeconds:0}),r[s.room_id].entries++,r[s.room_id].totalSeconds+=s.duration_seconds||0;return Object.values(r).sort((s,i)=>i.entries-s.entries)},async getPushSubscriptionCount(){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("push_subscriptions").select("*",{count:"exact",head:!0});return t?(this._err("getPushSubscriptionCount",t),0):e||0},async getRetentionSignals(){if(!this.ready)return{quietMembers:[],streakMembers:[]};const[e,t,r]=await Promise.all([this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(10080*6e4)).neq("status","offline"),this._sb.from("community_presence").select("user_id").gte("last_seen",this._ago(336*60*6e4)).lt("last_seen",this._ago(10080*6e4)),this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(4320*6e4))]),s=new Set((e.data||[]).map(n=>n.user_id)),a=[...new Set((t.data||[]).map(n=>n.user_id))].filter(n=>!s.has(n)).slice(0,5),l=(r.data||[]).filter(n=>n.profiles).slice(0,5).map(n=>({user_id:n.user_id,name:n.profiles?.name,emoji:n.profiles?.emoji}));return{quietMembers:a,streakMembers:l}},async getSafetyStats(){if(!this.ready)return{};const[e,t,r]=await Promise.all([this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("type","report").gte("created_at",this._ago(10080*6e4)),this._sb.from("blocked_users").select("*",{count:"exact",head:!0}),this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1)]);return{reportsThisWeek:e.count||0,blockedTotal:t.count||0,unreadNotifs:r.count||0}},async getRecentReflectionsAdmin(e=5){if(!this.ready)return[];const{data:t,error:r}=await this._sb.from("reflections").select("id, content, created_at, user_id, profiles!reflections_user_id_fkey(id, name, emoji, avatar_url)").order("created_at",{ascending:!1}).limit(e);if(r){this._err("getRecentReflectionsAdmin",r);const{data:s}=await this._sb.from("reflections").select("id, content, created_at, author_id").order("created_at",{ascending:!1}).limit(e);return s||[]}return t||[]},async adminUpdateGamification(e,{xpDelta:t=0,karmaDelta:r=0,unlockFeature:s=null,badgeId:i=null,badgeName:a=null,badgeIcon:l="🏅",badgeRarity:n="common",badgeXp:c=0,badgeDesc:d=""}={}){if(!this.ready)return!1;try{const{error:u}=await this._sb.rpc("update_user_gamification",{target_user_id:e,xp_delta:t,karma_delta:r,unlock_feature:s,badge_id:i,badge_name:a,badge_icon:l,badge_rarity:n,badge_xp:c,badge_desc:d});if(u)throw new Error(u.message);return!0}catch(u){return this._err("adminUpdateGamification",u),!1}},_unsub(e){this._subs[e]&&(this._subs[e].unsubscribe(),delete this._subs[e])},unsubscribeAll(){for(const e of Object.values(this._subs))try{e.unsubscribe()}catch{}this._subs={}},async _cleanup(){this.stopHeartbeat(),await this.setOffline(),this.unsubscribeAll()}};window.addEventListener("pagehide",()=>o._cleanup());window.CommunityDB=o;const _={state:{currentUser:{id:null,name:"Loading...",avatar:"?",emoji:"",avatar_url:null,bio:"",status:"online",role:"Member",karma:0,xp:0,badges:[],minutes:0,circles:0,offered:0,birthday:null,country:null,email:"",is_admin:!1},currentRoom:null,currentActivity:"✨ Available",presenceCount:0,presenceInterval:null,pulseSent:!1,timerRunning:!1,timeLeft:1200,currentView:"hubView",initialized:!1},config:{ROOM_MODULES:["SilentRoom","CampfireRoom","GuidedRoom","BreathworkRoom","OshoRoom","DeepWorkRoom","TarotRoom","ReikiRoom"],STATUS_RINGS:{silent:"#60a5fa",available:"#34d399",guiding:"#fbbf24",deep:"#a78bfa",resonant:"#f472b6",offline:"#d1d5db"},AVATAR_GRADIENTS:["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)","linear-gradient(135deg, #fa709a 0%, #fee140 100%)"],ADMIN_MODULES:["CollectiveField","LunarEngine","SolarEngine","UpcomingEvents","AdminDashboard"],RENDER_DELAY:100,CELESTIAL_INIT_DELAY:500,CELESTIAL_POLL_MAX:25,PRESENCE_INTERVAL:3e4,HEARTBEAT_INTERVAL:6e4,PULSE_COOLDOWN:6e4},async init(){if(this.state.initialized){console.warn("[Core] Already initialized");return}try{if(!await o.init())throw new Error("Database not ready - is the user logged in?");if(await this.loadCurrentUser(),!this.state.currentUser.avatar_url){const t=window.app?.state?.currentUser,r=t?.avatarUrl||t?.avatar_url||null;r&&(this.state.currentUser.avatar_url=r)}if(await o.setPresence(this.state.currentUser.status||"online",this.state.currentUser.activity||"✨ Available",null),o.startHeartbeat(this.config.HEARTBEAT_INTERVAL),window.addEventListener("pagehide",()=>{o.setOffline(),o.unsubscribeAll()}),this.setupEventListeners(),this.initializeSafetyModals(),this.initializeModules(),this.initializePracticeRooms(),this.scheduleRoomRendering(),this.scheduleCelestialInit(),this.updatePresenceCount(),setTimeout(()=>this._injectAdminUIAll(),1e3),this.state.initialized=!0,window._pendingHubScrollTarget){const t=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,(()=>{let i=0,a=0,l=0;const n=setInterval(()=>{if(i++,document.body.classList.contains("ritual-active")){a=0,l=0;return}const c=document.getElementById(t),d=c?c.offsetHeight:0;if(d>10&&(d===a?l++:l=0,a=d),(l>=3||i>=60)&&d>0){clearInterval(n);const p=document.getElementById("mobile-bottom-bar"),f=p?p.offsetHeight+16:16;requestAnimationFrame(()=>{const g=c.getBoundingClientRect().top+window.scrollY-f;window.scrollTo({top:g,behavior:"smooth"})})}else i>=60&&clearInterval(n)},100)})()}}catch(e){console.error("❌ [Core] Initialization failed:",e),this.handleInitializationError(e)}},async loadCurrentUser(){try{const e=await o.getMyProfile();if(!e){console.warn("[Core] No profile found for current user");return}const r=new Set(["online","available","away","guiding","silent","deep","offline"]).has(e.community_status)?e.community_status:"online";this.state.currentUser={id:e.id,name:e.name||"Anonymous",avatar:(e.name||"A").charAt(0).toUpperCase(),emoji:e.emoji||"",avatar_url:e.avatar_url||null,bio:e.inspiration||"Here to practice with intention.",status:r,community_status:r,role:e.is_admin?"Admin":e.community_role||"Member",community_role:e.community_role||"Member",minutes:e.total_minutes||0,circles:e.total_sessions||0,offered:e.gifts_given||0,birthday:e.birthday||null,country:e.country||null,email:e.email||"",is_admin:!!e.is_admin,karma:window.app?.gamification?.state?.karma??0,xp:window.app?.gamification?.state?.xp??0,badges:window.app?.gamification?.state?.badges??[]}}catch(e){console.error("[Core] loadCurrentUser failed:",e)}},initializeModules(){const e=[{name:"Rituals",instance:window.Rituals},{name:"ProfileModule",instance:window.ProfileModule},{name:"CommunityModule",instance:window.CommunityModule}];for(const{name:t,instance:r}of e)if(r?.init)try{r.init()}catch(s){console.error(`✗ [Core] ${t} init failed:`,s)}else console.warn(`⚠ [Core] ${t} not found or missing init()`);window.ActiveMembers?.render?window.ActiveMembers.render().catch(t=>console.error("✗ [Core] ActiveMembers.render() failed:",t)):console.warn("⚠ [Core] ActiveMembers not found")},_injectAdminUIAll(){for(const e of this.config.ADMIN_MODULES){const t=window[e];if(t?.injectAdminUI)try{t.injectAdminUI()}catch(r){console.warn(`[Core] injectAdminUI failed on ${e}:`,r)}}},handleInitializationError(e){this.showToast("Failed to initialize. Please refresh the page."),console.error("[Core] Init error details:",{message:e.message,stack:e.stack,state:this.state})},initializePracticeRooms(){const e=[];for(const t of this.config.ROOM_MODULES){const r=window[t];if(!r){console.warn(`⚠ [Core] ${t} not found on window`);continue}if(!r.init){console.warn(`⚠ [Core] ${t} missing init()`);continue}try{r.init(),e.push(r)}catch(s){console.error(`✗ [Core] ${t} init failed:`,s)}}window.PracticeRoom&&e.length&&PracticeRoom.startHubPresence(e)},scheduleRoomRendering(){setTimeout(()=>{try{this.renderRooms()}catch(e){console.error("[Core] Room rendering failed:",e)}},this.config.RENDER_DELAY)},renderRooms(){const e=document.getElementById("roomsGrid");if(!e){console.warn("[Core] #roomsGrid not found - skipping render");return}const t=this.config.ROOM_MODULES.reduce((r,s)=>{const i=window[s];if(!i?.getRoomCardHTML)return console.warn(`⚠ [Core] ${s} missing getRoomCardHTML()`),r;try{const a=i.getRoomCardHTML();a&&r.push(a)}catch(a){console.error(`✗ [Core] getRoomCardHTML failed for ${s}:`,a)}return r},[]);t.length?e.innerHTML=t.join(""):console.warn("[Core] No room cards to render")},scheduleCelestialInit(){setTimeout(()=>{try{this.initializeCelestialSystems()}catch(e){console.error("[Core] Celestial init failed:",e)}},this.config.CELESTIAL_INIT_DELAY)},initializeCelestialSystems(){for(const[e,t]of[["LunarEngine",window.LunarEngine],["SolarEngine",window.SolarEngine]])if(t?.init)try{t.init()}catch(r){console.error(`✗ [Core] ${e} init failed:`,r)}else console.warn(`⚠ [Core] ${e} not found`)},navigateTo(e){try{const t=document.getElementById("communityHubFullscreenContainer"),r=document.getElementById("community-hub-tab");e==="hubView"?(t&&(t.style.display="none"),r&&(r.style.display="block"),document.body.style.overflow="",document.querySelectorAll("#hubView").forEach(s=>s.classList.add("active")),this.state.currentView="hubView"):e==="practiceRoomView"?(t&&(t.style.display="flex",t.querySelector("#openingOverlay")?.classList.remove("active"),t.querySelector("#closingOverlay")?.classList.remove("active")),r?r.style.display="none":console.error("[Core] Hub tab element not found"),document.body.style.overflow="hidden",this.state.currentView="practiceRoomView"):console.warn(`[Core] Unknown viewId: "${e}"`)}catch(t){console.error("[Core] Navigation error:",t)}},setupEventListeners(){document.addEventListener("click",e=>{e.target.classList.contains("modal-overlay")&&e.target.classList.remove("active")}),document.addEventListener("keydown",e=>{e.key==="Escape"&&document.querySelector(".modal-overlay.active")?.classList.remove("active")})},async updatePresenceCount(){this.state.presenceInterval&&clearInterval(this.state.presenceInterval);const e=async()=>{try{if(!o.ready)return;const t=await o.getActiveMembers();this.state.presenceCount=t.length;const r=document.getElementById("presenceCount");r&&(r.textContent=t.length)}catch(t){console.error("[Core] updatePresenceCount error:",t)}};await e(),this.state.presenceInterval=setInterval(e,this.config.PRESENCE_INTERVAL)},sendPulse(){if(this.state.pulseSent){this.showToast("Please wait before sending another pulse");return}this.state.pulseSent=!0,this.showToast("Pulse sent to the community"),setTimeout(()=>{this.state.pulseSent=!1},this.config.PULSE_COOLDOWN)},showToast(e,t=3e3){const r=document.getElementById("toast");if(!r){console.warn("[Core] #toast element not found");return}r.textContent=e,r.classList.add("show"),setTimeout(()=>r.classList.remove("show"),t)},initializeSafetyModals(){document.getElementById("reportModal")||document.body.insertAdjacentHTML("beforeend",`
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
        `)},formatTime(e){if(typeof e!="number"||e<0)return"0:00";const t=Math.floor(e/60),r=Math.floor(e%60);return`${t}:${r.toString().padStart(2,"0")}`},getAvatarGradient(e){(!e||typeof e!="string")&&(e="default");const t=e.split("").reduce((r,s)=>r+s.charCodeAt(0),0);return this.config.AVATAR_GRADIENTS[Math.abs(t)%this.config.AVATAR_GRADIENTS.length]}};window.Core=_;const m={state:{isOpen:!1,view:"inbox",threadPartnerId:null,threadPartnerName:null,realtimeSub:null,bgSub:null},init(){if(document.getElementById("whisperModal"))return;const e=document.createElement("div");e.innerHTML=`
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
            </div>`,document.body.appendChild(e.firstElementChild),document.getElementById("whisperModal").addEventListener("click",r=>{r.target.id==="whisperModal"&&this.close()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&this.state.isOpen&&this.close()});const t=()=>{o?.ready?this.startBackgroundListener():setTimeout(t,500)};t()},async open(){this._openShared(),await this._showInbox()},async openThread(e,t,r,s){this._openShared(),await this._showThread(e,t,r,s)},_openShared(){this.init(),this._animateIn(),this.state.isOpen=!0,document.body.style.overflow="hidden",this._subscribeRealtime()},close(){const e=document.getElementById("whisperModal"),t=document.getElementById("whisperModalInner");e&&(e.style.opacity="0",t.style.transform="translateY(20px)",setTimeout(()=>{e.style.display="none",this.state.isOpen=!1,this.state.view="inbox",this.state.threadPartnerId=null,document.body.style.overflow="",this.state.realtimeSub?.unsubscribe?.(),this.state.realtimeSub=null},250))},_animateIn(){const e=document.getElementById("whisperModal"),t=document.getElementById("whisperModalInner");e.style.display="flex",requestAnimationFrame(()=>{e.style.opacity="1",t.style.transform="translateY(0)"})},_setView(e){const t=e==="inbox";document.getElementById("whisperInboxView").style.display=t?"block":"none",document.getElementById("whisperThreadView").style.display=t?"none":"flex",document.getElementById("whisperReplyBar").style.display=t?"none":"block",document.getElementById("whisperBackBtn").style.display=t?"none":"inline-flex";const r=document.getElementById("whisperModalSubtitle");t&&(document.getElementById("whisperModalTitle").textContent="Whispers",r.style.display="none")},async _showInbox(){this.state.view="inbox",this.state.threadPartnerId=null,this._setView("inbox");const e=document.getElementById("whisperInboxLoading"),t=document.getElementById("whisperInboxEmpty"),r=document.getElementById("whisperInboxList");e.style.display="block",t.style.display="none",r.innerHTML="";const s=await o.getWhisperInbox();if(e.style.display="none",!s.length){t.style.display="block";return}r.innerHTML=s.map(i=>this._conversationRowHTML(i)).join(""),this._setBadge(s.reduce((i,a)=>i+a.unread,0))},_conversationRowHTML(e){const t=e.partner||{},r=this._escape(t.name||"Member"),s=this._avatarHTML(t,44),i=this._escape(e.lastMessage||""),a=this._relativeTime(e.lastAt),l=this._escape(t.id||""),n=this._escape(t.emoji||""),c=this._escape(t.avatar_url||""),d=e.unread>0;return`
            <div data-partner-id="${l}"
                 onclick="WhisperModal._showThread('${l}','${r}','${n}','${c}')"
                 style="display:flex;align-items:center;gap:14px;padding:0.9rem 1.75rem;
                        cursor:pointer;transition:background 0.15s;
                        border-bottom:1px solid rgba(0,0,0,0.04);"
                 onmouseover="this.style.background='rgba(0,0,0,0.03)'"
                 onmouseout="this.style.background='transparent'">

                <div style="position:relative;flex-shrink:0;">
                    ${s}
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
                            ${r}
                        </span>
                        <span style="font-size:0.7rem;color:var(--text-muted);flex-shrink:0;">
                            ${a}
                        </span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);
                                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                                font-weight:${d?"600":"400"};">
                        ${i}
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
            </div>`},async _showThread(e,t,r,s){this.state.view="thread",this.state.threadPartnerId=e,this.state.threadPartnerName=t,this._setView("thread"),document.getElementById("whisperModalTitle").textContent=t;const i=document.getElementById("whisperModalSubtitle");i.textContent="Private whisper thread",i.style.display="block";const a=document.getElementById("whisperThreadLoading"),l=document.getElementById("whisperThreadMessages"),n=document.getElementById("whisperThreadView");a.style.display="block",l.innerHTML="";const[c]=await Promise.all([o.getWhispers(e),o.markConversationRead(e)]);a.style.display="none",this._renderThreadMessages(c),setTimeout(()=>{n.scrollTop=n.scrollHeight},50),document.getElementById("whisperReplyText")?.focus(),await this.refreshUnreadBadge()},_renderThreadMessages(e){const t=document.getElementById("whisperThreadMessages");if(!t)return;if(!e.length){t.innerHTML=`
                <div style="text-align:center;padding:3rem;
                            color:var(--text-muted);font-size:0.85rem;">
                    No messages yet — say something ✨
                </div>`;return}const r=o._uid;t.innerHTML=e.map(s=>{const i=s.sender_id===r||s.sender?.id===r;return this._messageBubbleHTML(i,this._escape(s.message),this._relativeTime(s.created_at))}).join("")},_appendMessage(e){const t=document.getElementById("whisperThreadMessages");if(!t)return;t.querySelector("[data-empty]")?.remove();const r=e.sender_id===o._uid,s=document.createElement("div");s.innerHTML=this._messageBubbleHTML(r,this._escape(e.message),this._relativeTime(e.created_at)),t.appendChild(s.firstElementChild),document.getElementById("whisperThreadView")?.scrollTo({top:999999})},_messageBubbleHTML(e,t,r){return`
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
                    ${r}
                </span>
            </div>`},async _sendReply(){const e=document.getElementById("whisperReplyText"),t=e?.value.trim();if(!t||!this.state.threadPartnerId)return;const r=document.getElementById("whisperReplyBtn");r&&(r.disabled=!0,r.textContent="…"),e.disabled=!0;try{await o.sendWhisper(this.state.threadPartnerId,t)?(e.value="",this._appendMessage({sender_id:o._uid,message:t,created_at:new Date().toISOString()})):window.Core.showToast("Could not send — please try again")}catch(s){console.error("[WhisperModal] sendReply:",s),window.Core.showToast("Could not send — please try again")}finally{r&&(r.disabled=!1,r.textContent="Send"),e.disabled=!1,e.focus()}},_replyKeydown(e){e.key==="Enter"&&(e.metaKey||e.ctrlKey)&&(e.preventDefault(),this._sendReply())},_subscribeRealtime(){this.state.realtimeSub?.unsubscribe?.(),this.state.realtimeSub=o.subscribeToWhispers(e=>{this.state.view==="thread"&&e.sender_id===this.state.threadPartnerId?(this._appendMessage(e),o.markConversationRead(e.sender_id).catch(()=>{})):(window.Core.showToast(`New whisper from ${e.sender?.name||"Someone"}`),this.state.view==="inbox"?this._showInbox():this.refreshUnreadBadge())})},async refreshUnreadBadge(){this._setBadge(await o.getUnreadWhisperCount().catch(()=>0))},_setBadge(e){const t=document.getElementById("whisperUnreadBadge");t&&(t.textContent=e>99?"99+":e,t.style.display=e>0?"inline-flex":"none")},startBackgroundListener(){this.state.bgSub||o?.ready&&(this.refreshUnreadBadge().catch(()=>{}),this.state.bgSub=o.subscribeToWhispersBackground(e=>{this.state.isOpen&&this.state.view==="thread"&&e.sender_id===this.state.threadPartnerId||this.refreshUnreadBadge().catch(()=>{})}))},_avatarHTML(e,t=44){const r=t+"px";if(e?.avatar_url)return`<img src="${e.avatar_url}"
                         width="${t}" height="${t}" loading="lazy" decoding="async"
                         style="width:${r};height:${r};border-radius:50%;
                                object-fit:cover;display:block;"
                         alt="${this._escape(e.name||"")}">`;const s=window.Core.getAvatarGradient(e?.id||""),i=e?.emoji||(e?.name||"?").charAt(0).toUpperCase();return`<div style="width:${r};height:${r};border-radius:50%;
                            background:${s};
                            display:flex;align-items:center;justify-content:center;
                            font-size:${Math.round(t*.42)}px;flex-shrink:0;
                            box-shadow:2px 2px 6px rgba(0,0,0,0.1);">
                    ${this._escape(i)}
                </div>`},_relativeTime(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),r=Math.floor(t/6e4);if(r<1)return"just now";if(r<60)return`${r}m ago`;const s=Math.floor(r/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})},_escape(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}};window.WhisperModal=m;const y=Object.freeze(Object.defineProperty({__proto__:null,WhisperModal:m},Symbol.toStringTag,{value:"Module"}));export{o as C,y as W,_ as a};
