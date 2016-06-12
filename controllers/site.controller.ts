import * as renderHelper from '../common/render-helper';
import * as config from '../config';
import * as Loader from 'loader';
import { TopicService } from '../services/topic.service';
var topicService = new TopicService();

export class SiteController {

    index(req, res, next) {
        var page = parseInt(req.query.page, 10) || 1;
        page = page > 0 ? page : 1;
        var tab = req.query.tab || 'all';

        // 取主题
        var query = {};
        if (tab && tab !== 'all') {
            if (tab === 'good') {
                query.good = true;
            } else {
                query.tab = tab;
            }
        }

        topicService.getTopicByQuery().then(topics => {
            var all_topics_count = topics.length;
            var limit = config.list_topic_count;
            var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at' };
            var pages = Math.ceil(all_topics_count / limit);
            var tabName = renderHelper.tabName(tab);
            res.render('index', {
                topics: topics,
                current_page: 0,
                list_topic_count: 10,
                tops: topics,
                no_reply_topics: topics,
                pages: pages,
                tabs: config.tabs,
                tab: tab,
                pageTitle: tabName && (tabName + '版块'),
            });
        });
    }
}