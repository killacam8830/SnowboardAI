import { useEffect, useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Transition } from '@headlessui/react';
import { pageNames } from '@shared/lib/pages';
import { colord } from 'colord';
import { getSiteProfile } from '@launch/api/DataApi';
import {
	installPlugin,
	activatePlugin,
	updateTemplatePart,
	addPagesToNav,
	addPatternSectionsToNav,
	updateOption,
	getOption,
	getPageById,
	getActivePlugins,
	prefetchAssistData,
	postLaunchFunctions,
} from '@launch/api/WPApi';
import { PagesSkeleton } from '@launch/components/CreatingSite/PageSkeleton';
import { useCanLaunch } from '@launch/hooks/useCanLaunch';
import { useConfetti } from '@launch/hooks/useConfetti';
import { useWarnOnLeave } from '@launch/hooks/useWarnOnLeave';
import {
	updateButtonLinks,
	updateSinglePageLinksToContactSection,
} from '@launch/lib/linkPages';
import { uploadLogo } from '@launch/lib/logo';
import { waitFor200Response, wasInstalled } from '@launch/lib/util';
import {
	createWpPages,
	generateCustomPageContent,
	replacePlaceholderPatterns,
	updateGlobalStyleVariant,
} from '@launch/lib/wp';
import { usePagesStore } from '@launch/state/Pages';
import { usePagesSelectionStore } from '@launch/state/pages-selections';
import { useUserSelectionStore } from '@launch/state/user-selections';
import { Logo, Spinner } from '@launch/svg';

export const CreatingSite = () => {
	const [isShowing] = useState(true);
	const [confettiReady, setConfettiReady] = useState(false);
	const [confettiColors, setConfettiColors] = useState(['#ffffff']);
	const [warnOnLeaveReady, setWarnOnLeaveReady] = useState(true);
	const canLaunch = useCanLaunch();
	const {
		goals,
		businessInformation,
		siteType,
		siteInformation,
		siteTypeSearch,
		siteStructure,
		getGoalsPlugins,
		variation,
	} = useUserSelectionStore();

	const { pages, style } = usePagesSelectionStore();

	const [info, setInfo] = useState([]);
	const [infoDesc, setInfoDesc] = useState([]);
	const inform = (msg) => setInfo((info) => [msg, ...info]);
	const informDesc = (msg) => setInfoDesc((infoDesc) => [msg, ...infoDesc]);
	const [pagesToAnimate, setPagesToAnimate] = useState([]);
	const { setPage } = usePagesStore();

	useWarnOnLeave(warnOnLeaveReady);

	const doEverything = useCallback(async () => {
		if (!canLaunch) {
			throw new Error(__('Site is not ready to launch.', 'extendify-local'));
		}

		// As we add more site structures, abstract these into configs
		const addPatternsAsNav = siteStructure === 'single-page';
		const linkButtonsToPages = siteStructure === 'multi-page';
		const stickyNav = siteStructure === 'single-page';

		try {
			await updateOption('permalink_structure', '/%postname%/');
			await waitFor200Response();
			inform(__('Applying your website styles', 'extendify-local'));
			informDesc(__('Creating a beautiful website', 'extendify-local'));
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (businessInformation.description) {
				const profile = await getSiteProfile({
					title: siteInformation.title,
					description: businessInformation.description,
					siteType,
				});
				await waitFor200Response();
				await updateOption('extendify_site_profile', profile);
			}

			await waitFor200Response();
			await updateGlobalStyleVariant(variation ?? {});

			await waitFor200Response();
			await updateTemplatePart('extendable/header', style?.headerCode);

			await waitFor200Response();
			await updateTemplatePart('extendable/footer', style?.footerCode);

			const goalsPlugins = getGoalsPlugins();
			const requiredPlugins = window.extSharedData?.requiredPlugins ?? [];

			// Add required plugins to the end of the list to give them lower priority
			// when filtering out duplicates.
			const sortedPlugins = [...goalsPlugins, ...requiredPlugins]
				// Remove duplicates
				.reduce((acc, plugin) => {
					const found = acc.find(
						({ wordpressSlug: s }) => s === plugin.wordpressSlug,
					);
					return found ? acc : [...acc, plugin];
				}, [])
				// We add give to the front. See here why:
				// https://github.com/extendify/company-product/issues/713
				.sort(({ wordpressSlug }) => (wordpressSlug === 'give' ? -1 : 1));

			if (sortedPlugins?.length) {
				inform(__('Installing necessary plugins', 'extendify-local'));

				for (const [index, plugin] of sortedPlugins.entries()) {
					informDesc(
						__(
							`${index + 1}/${sortedPlugins.length}: ${plugin.name}`,
							'extendify-local',
						),
					);

					// Install plugin (2 attempts)
					try {
						await waitFor200Response();
						await installPlugin(plugin);
					} catch (_) {
						// If this fails, wait and try again
						await waitFor200Response();
						await installPlugin(plugin);
					}

					// Activate plugin  (2 attempts)
					try {
						await waitFor200Response();
						await activatePlugin(plugin);
					} catch (_) {
						// If this fails, wait and try again
						await waitFor200Response();
						await activatePlugin(plugin);
					}
				}
			}

			inform(__('Populating data', 'extendify-local'));
			informDesc(__('Personalizing your experience', 'extendify-local'));
			await prefetchAssistData();
			await waitFor200Response();

			inform(__('Adding page content', 'extendify-local'));
			informDesc(__('Starting off with a full website', 'extendify-local'));
			await new Promise((resolve) => setTimeout(resolve, 1000));
			await waitFor200Response();

			const homePage = {
				name: pageNames.home.title,
				id: 'home',
				patterns: style.patterns,
				slug: 'home',
			};
			const blogPage = {
				name: pageNames.blog.title,
				id: 'blog',
				patterns: [],
				slug: 'blog',
			};

			await waitFor200Response();
			if (businessInformation.description) {
				informDesc(__('Creating pages with custom content', 'extendify-local'));
				[homePage, ...pages].forEach((page) =>
					setPagesToAnimate((previous) => [...previous, page.name]),
				);
			}

			const hasBlogGoal = goals?.find((goal) => goal.slug === 'blog');
			const pagesToCreate = [
				...pages,
				homePage,
				hasBlogGoal ? blogPage : null,
			].filter(Boolean);

			const pagesWithReplacedPatterns = [];
			// Run these one page at a time so we don't end up with duplicate dependency issues
			for (const page of pagesToCreate) {
				const updatedPage = {
					...page,
					patterns: await replacePlaceholderPatterns(page.patterns),
				};
				pagesWithReplacedPatterns.push(updatedPage);
			}

			const pagesWithCustomContent = await generateCustomPageContent(
				pagesWithReplacedPatterns,
				{
					goals,
					businessInformation,
					siteType,
					siteInformation,
					siteTypeSearch,
				},
			);

			const createdPages = await createWpPages(pagesWithCustomContent, {
				stickyNav,
			});
			const pagesWithLinksUpdated = linkButtonsToPages
				? await updateButtonLinks(createdPages)
				: updateSinglePageLinksToContactSection(
						createdPages,
						pagesWithCustomContent,
					);

			setPagesToAnimate([]);
			await waitFor200Response();
			informDesc(__('Setting up site layout', 'extendify-local'));
			const addBlogPageToNav = goals?.some((goal) => goal.slug === 'blog');

			const navPagesMultiPageSite = [
				...pages,
				addBlogPageToNav ? blogPage : null,
				homePage,
			]
				.filter(Boolean)
				// Sorted AZ by title in all languages
				.sort((a, b) => a?.name?.localeCompare(b?.name));

			const pluginPages = [];

			// Fetch active plugins after installing plugins
			let { data: activePlugins } = await getActivePlugins();

			// Add plugin related pages only if plugin is active
			if (wasInstalled(activePlugins, 'woocommerce')) {
				const shopPageId = await getOption('woocommerce_shop_page_id');
				const shopPage = await getPageById(shopPageId);

				if (shopPage) {
					pluginPages.push(shopPage);
				}
			}

			if (wasInstalled(activePlugins, 'the-events-calendar')) {
				const eventsPage = {
					title: {
						rendered: __('Events', 'extendify-local'),
					},
					link: '/events',
				};

				pluginPages.push(eventsPage);
			}

			if (wasInstalled(activePlugins, 'wpforms-lite')) {
				await updateOption('wpforms_activation_redirect', 'skip');
			}

			if (wasInstalled(activePlugins, 'all-in-one-seo-pack')) {
				await updateOption('aioseo_activation_redirect', 'skip');
			}

			if (wasInstalled(activePlugins, 'google-analytics-for-wordpress')) {
				await updateOption(
					'_transient__monsterinsights_activation_redirect',
					null,
				);
			}

			// Upload Logo
			await uploadLogo(
				'https://assets.extendify.com/demo-content/logos/extendify-demo-logo.png',
			);
			await waitFor200Response();

			const updatedHeaderCode = addPatternsAsNav
				? await addPatternSectionsToNav(
						homePage?.patterns ?? [],
						style?.headerCode,
					)
				: await addPagesToNav(
						navPagesMultiPageSite,
						pagesWithLinksUpdated,
						pluginPages,
						style?.headerCode,
					);

			await waitFor200Response();
			await updateTemplatePart('extendable/header', updatedHeaderCode);

			inform(__('Setting up your Site Assistant', 'extendify-local'));
			informDesc(__('Helping you to succeed', 'extendify-local'));
			await new Promise((resolve) => setTimeout(resolve, 1000));
			await waitFor200Response();
			inform(__('Your website has been created!', 'extendify-local'));
			informDesc(__('Redirecting in 3, 2, 1...', 'extendify-local'));
			// fire confetti here
			setConfettiReady(true);
			setWarnOnLeaveReady(false);
			await new Promise((resolve) => setTimeout(resolve, 2500));

			await waitFor200Response();
			await updateOption(
				'extendify_onboarding_completed',
				new Date().toISOString(),
			);
		} catch (e) {
			console.error(e);
			// if the error is 4xx, we should stop trying and prompt them to reload
			if (e.status >= 400 && e.status < 500) {
				setWarnOnLeaveReady(false);
				const alertMsg = __(
					'We encountered a server error we cannot recover from. Please reload the page and try again.',
					'extendify-local',
				);
				alert(alertMsg);
				location.href = window.extSharedData.adminUrl;
			}
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return doEverything();
		}
	}, [
		pages,
		getGoalsPlugins,
		style,
		canLaunch,
		goals,
		businessInformation,
		siteType,
		siteInformation,
		siteTypeSearch,
		setPagesToAnimate,
		siteStructure,
		variation,
	]);

	useEffect(() => {
		doEverything().then(async () => {
			setPage(0);
			// This will trigger the post launch php functions.
			await postLaunchFunctions();
			window.location.replace(
				window.extSharedData.adminUrl +
					'admin.php?page=extendify-assist&extendify-launch-success',
			);
		});
	}, [doEverything, setPage]);

	useEffect(() => {
		const documentStyles = window.getComputedStyle(document.body);
		const partnerBg = documentStyles?.getPropertyValue('--ext-banner-main');
		const partnerText = documentStyles?.getPropertyValue('--ext-banner-text');
		if (partnerBg) {
			setConfettiColors([
				colord(partnerBg).darken(0.3).toHex(),
				colord(partnerText).alpha(0.5).toHex(),
				colord(partnerBg).lighten(0.2).toHex(),
			]);
		}
	}, []);

	useConfetti(
		{
			particleCount: 3,
			angle: 320,
			spread: 220,
			origin: { x: 0, y: 0 },
			colors: confettiColors,
		},
		2500,
		confettiReady,
	);

	return (
		<Transition
			as="div"
			show={isShowing}
			appear={true}
			enter="transition-all ease-in-out duration-500"
			enterFrom="md:w-40vw md:max-w-md"
			enterTo="md:w-full md:max-w-full"
			className="flex shrink-0 flex-col justify-between bg-banner-main px-10 py-12 text-banner-text md:h-screen">
			<div className="max-w-prose">
				<div className="md:min-h-48">
					{window.extSharedData?.partnerLogo ? (
						<div className="mb-8">
							<img
								style={{ maxWidth: '200px' }}
								src={window.extSharedData.partnerLogo}
								alt={window.extSharedData?.partnerName ?? ''}
							/>
						</div>
					) : (
						<Logo className="logo mb-8 w-32 text-banner-text sm:w-40" />
					)}
					<div data-test="message-area">
						{info.map((step, index) => {
							if (!index) {
								return (
									<Transition
										as="div"
										appear={true}
										show={isShowing}
										enter="transition-opacity duration-1000"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="transition-opacity duration-1000"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
										className="flex items-center space-x-4 text-4xl"
										key={step}>
										{step}
									</Transition>
								);
							}
						})}
						<div className="mt-6 flex items-center space-x-4">
							<Spinner className="spin" />
							{infoDesc.map((step, index) => {
								if (!index) {
									return (
										<Transition
											as="div"
											appear={true}
											show={isShowing}
											enter="transition-opacity duration-1000"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="transition-opacity duration-1000"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
											className="text-lg"
											key={step}>
											{step}
										</Transition>
									);
								}
							})}
						</div>
						{pagesToAnimate.length > 0 ? (
							<PagesSkeleton pages={pagesToAnimate} />
						) : null}
					</div>
				</div>
			</div>
		</Transition>
	);
};