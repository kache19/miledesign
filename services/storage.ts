import {
  AboutContent,
  AdminProfile,
  ContactDetails,
  Project,
  Service,
  SiteContentData,
  SocialLink,
  SubAdmin,
  TeamMember,
  Testimonial,
  VlogEntry
} from '../types';
import {
  ABOUT_CONTENT,
  ADMIN_PROFILE,
  CONTACT_DETAILS,
  PROJECTS,
  SERVICES,
  SOCIAL_LINKS,
  TEAM_MEMBERS,
  TESTIMONIALS,
  VLOG_ENTRIES
} from '../constants';
import { supabase } from './supabase';

const TABLE = 'site_content';
const SINGLETON_ID = 'main';

const defaultData: SiteContentData = {
  projects: PROJECTS,
  services: SERVICES,
  testimonials: TESTIMONIALS,
  socialLinks: SOCIAL_LINKS,
  contactDetails: CONTACT_DETAILS,
  aboutContent: ABOUT_CONTENT,
  teamMembers: TEAM_MEMBERS,
  vlogEntries: VLOG_ENTRIES,
  adminProfile: ADMIN_PROFILE
};

const normalizeContactDetails = (parsed: Partial<ContactDetails> | null | undefined): ContactDetails => ({
  ...CONTACT_DETAILS,
  ...parsed,
  phoneNumbers: Array.isArray(parsed?.phoneNumbers) ? parsed!.phoneNumbers : CONTACT_DETAILS.phoneNumbers
});

const normalizeAboutContent = (parsed: Partial<AboutContent> | null | undefined): AboutContent => ({
  ...ABOUT_CONTENT,
  ...parsed,
  stats: Array.isArray(parsed?.stats) && parsed!.stats.length > 0 ? parsed!.stats : ABOUT_CONTENT.stats,
  homeBackgroundImages:
    Array.isArray(parsed?.homeBackgroundImages) && parsed!.homeBackgroundImages.length > 0
      ? parsed!.homeBackgroundImages
      : ABOUT_CONTENT.homeBackgroundImages
});

const normalizeSocialLinks = (parsed: SocialLink[] | null | undefined): SocialLink[] => {
  if (!Array.isArray(parsed)) return SOCIAL_LINKS;
  const existingIds = new Set(parsed.map((item) => item.id));
  const missingDefaults = SOCIAL_LINKS.filter((item) => !existingIds.has(item.id));
  return missingDefaults.length > 0 ? [...parsed, ...missingDefaults] : parsed;
};

const normalizeSubAdmins = (subAdmins: unknown): SubAdmin[] => {
  if (!Array.isArray(subAdmins)) return ADMIN_PROFILE.subAdmins;
  return subAdmins.filter(
    (item): item is SubAdmin =>
      Boolean(item && typeof item === 'object' && typeof (item as SubAdmin).id === 'string' && typeof (item as SubAdmin).email === 'string')
  );
};

const normalizeAdminProfile = (parsed: Partial<AdminProfile> | null | undefined): AdminProfile => ({
  ...ADMIN_PROFILE,
  ...parsed,
  subAdmins: normalizeSubAdmins(parsed?.subAdmins)
});

const normalizeSiteContent = (raw: Partial<SiteContentData> | null | undefined): SiteContentData => ({
  projects: Array.isArray(raw?.projects) ? raw!.projects : PROJECTS,
  services: Array.isArray(raw?.services) ? raw!.services : SERVICES,
  testimonials: Array.isArray(raw?.testimonials) ? raw!.testimonials : TESTIMONIALS,
  socialLinks: normalizeSocialLinks(raw?.socialLinks),
  contactDetails: normalizeContactDetails(raw?.contactDetails),
  aboutContent: normalizeAboutContent(raw?.aboutContent),
  teamMembers: Array.isArray(raw?.teamMembers) ? raw!.teamMembers : TEAM_MEMBERS,
  vlogEntries: Array.isArray(raw?.vlogEntries) ? raw!.vlogEntries : VLOG_ENTRIES,
  adminProfile: normalizeAdminProfile(raw?.adminProfile)
});

const ensureSingletonRow = async (): Promise<SiteContentData> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('content')
    .eq('id', SINGLETON_ID)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch site content: ${error.message}`);
  }

  if (data?.content) {
    return normalizeSiteContent(data.content as Partial<SiteContentData>);
  }

  const { error: insertError } = await supabase.from(TABLE).upsert(
    {
      id: SINGLETON_ID,
      content: defaultData
    },
    { onConflict: 'id' }
  );

  if (insertError) {
    throw new Error(`Failed to initialize site content: ${insertError.message}`);
  }

  return defaultData;
};

export const storageService = {
  async getAllContent(): Promise<SiteContentData> {
    return ensureSingletonRow();
  },

  async saveAllContent(data: SiteContentData): Promise<void> {
    const normalized = normalizeSiteContent(data);
    const { error } = await supabase.from(TABLE).upsert(
      {
        id: SINGLETON_ID,
        content: normalized
      },
      { onConflict: 'id' }
    );

    if (error) {
      throw new Error(`Failed to save site content: ${error.message}`);
    }
  },

  async getProjects(): Promise<Project[]> {
    const data = await ensureSingletonRow();
    return data.projects;
  },

  async saveProjects(projects: Project[]): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, projects });
  },

  async getServices(): Promise<Service[]> {
    const data = await ensureSingletonRow();
    return data.services;
  },

  async saveServices(services: Service[]): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, services });
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const data = await ensureSingletonRow();
    return data.testimonials;
  },

  async saveTestimonials(testimonials: Testimonial[]): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, testimonials });
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    const data = await ensureSingletonRow();
    return data.socialLinks;
  },

  async saveSocialLinks(socialLinks: SocialLink[]): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, socialLinks });
  },

  async getContactDetails(): Promise<ContactDetails> {
    const data = await ensureSingletonRow();
    return data.contactDetails;
  },

  async saveContactDetails(contactDetails: ContactDetails): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, contactDetails });
  },

  async getAboutContent(): Promise<AboutContent> {
    const data = await ensureSingletonRow();
    return data.aboutContent;
  },

  async saveAboutContent(aboutContent: AboutContent): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, aboutContent });
  },

  async getAdminProfile(): Promise<AdminProfile> {
    const data = await ensureSingletonRow();
    return data.adminProfile;
  },

  async saveAdminProfile(adminProfile: AdminProfile): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, adminProfile: normalizeAdminProfile(adminProfile) });
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    const data = await ensureSingletonRow();
    return data.teamMembers;
  },

  async saveTeamMembers(teamMembers: TeamMember[]): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, teamMembers });
  },

  async getVlogEntries(): Promise<VlogEntry[]> {
    const data = await ensureSingletonRow();
    return data.vlogEntries;
  },

  async saveVlogEntries(vlogEntries: VlogEntry[]): Promise<void> {
    const data = await ensureSingletonRow();
    await this.saveAllContent({ ...data, vlogEntries });
  },

  async reset(): Promise<void> {
    await this.saveAllContent(defaultData);
  }
};

export const authService = {
  async createUserFromAdmin(email: string, password: string): Promise<void> {
    const { data: currentSessionData } = await supabase.auth.getSession();
    const currentSession = currentSessionData.session;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }

    // Keep the current admin logged in after creating a sub-admin account.
    if (currentSession?.access_token && currentSession.refresh_token) {
      const { error: restoreError } = await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token
      });
      if (restoreError) {
        throw new Error(`Sub-admin created, but failed to restore admin session: ${restoreError.message}`);
      }
    }
  },

  async signUp(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  },

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUserEmail(): Promise<string | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return data.user?.email ?? null;
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      throw new Error(error.message);
    }
  },

  onAuthStateChange(callback: (email: string | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user?.email ?? null);
    });

    return () => data.subscription.unsubscribe();
  }
};
